import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Project } from 'src/projects/entities/project.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async send(data: CreateMessageDto, projectId: number, senderId: number) {
    try {
      // Validate that the project exists
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: ['client', 'assignedFreelancer'],
      });

      if (!project) {
        return {
          success: false,
          message: `Project with ID ${projectId} not found`,
        };
      }

      // We'll allow any messages to be sent between users
      // The frontend will handle filtering what messages to display

      // Use the receiverId from the DTO
      const receiver = { id: data.receiverId };

      // Create and save the message
      const message = this.messageRepository.create({
        message: data.message,
        project: { id: projectId },
        sender: { id: senderId },
        receiver,
        attachmentUrl: data.attachmentUrl,
      });

      const savedMessage = await this.messageRepository.save(message);

      // Load relations for the saved message
      const completeMessage = await this.messageRepository.findOne({
        where: { id: savedMessage.id },
        relations: ['sender', 'receiver', 'project'],
      });

      return {
        success: true,
        message: 'Message sent successfully',
        data: completeMessage,
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        message: 'Failed to send message',
        error: error.message,
      };
    }
  }

  async getMessages(projectId: number, userId: number, userRole: string) {
    try {
      // Validate that the project exists
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: ['client', 'assignedFreelancer'],
      });

      if (!project) {
        return {
          success: false,
          message: `Project with ID ${projectId} not found`,
          data: [],
        };
      }

      // Check access based on user role
      if (userRole === 'freelancer') {
        // For freelancers, check if they're involved in this project
        const isAssigned = project.assignedFreelancer?.id === userId;

        // Check if they've sent or received messages for this project
        const hasMessages = await this.messageRepository.findOne({
          where: [
            { project: { id: projectId }, sender: { id: userId } },
            { project: { id: projectId }, receiver: { id: userId } },
          ],
        });

        // If not assigned and no messages, still allow access but return empty array
        // This allows freelancers to start conversations with clients
        if (!hasMessages && !isAssigned) {
          console.log(
            'Freelancer not involved in project, returning empty messages array',
          );
          return {
            success: true,
            data: [],
          };
        }

        // Get all messages for this project where the freelancer is either sender or receiver
        const messages = await this.messageRepository.find({
          where: [
            { project: { id: projectId }, sender: { id: userId } },
            { project: { id: projectId }, receiver: { id: userId } },
          ],
          relations: ['sender', 'receiver', 'project'],
          order: { createdAt: 'ASC' },
        });

        return {
          success: true,
          data: messages,
        };
      } else if (userRole === 'client') {
        // Ensure the client owns the project
        if (project.client.id !== userId) {
          return {
            success: false,
            message: 'You do not have access to this project',
            data: [],
          };
        }

        // Get all messages for this project
        const messages = await this.messageRepository.find({
          where: { project: { id: projectId } },
          relations: ['sender', 'receiver', 'project'],
          order: { createdAt: 'ASC' },
        });

        return {
          success: true,
          data: messages,
        };
      } else {
        return {
          success: false,
          message: 'Invalid user role',
          data: [],
        };
      }
    } catch (error) {
      console.error('Error getting messages:', error);
      return {
        success: false,
        message: 'Failed to retrieve messages',
        error: error.message,
        data: [],
      };
    }
  }

  async getConversations(userId: number, userRole: string) {
    try {
      let projectIds: number[] = [];

      if (userRole === 'client') {
        // Get all projects owned by this client that have messages
        const projects = await this.projectRepository
          .createQueryBuilder('project')
          .innerJoin('project.messages', 'message')
          .where('project.clientId = :userId', { userId })
          .select('project.id')
          .distinct(true)
          .getRawMany();

        projectIds = projects.map((p) => p.project_id);
      } else if (userRole === 'freelancer') {
        // Get all projects where this freelancer is either assigned, has sent messages, or received messages
        const messageProjects = await this.messageRepository
          .createQueryBuilder('message')
          .innerJoin('message.project', 'project')
          .where('message.senderId = :userId OR message.receiverId = :userId', {
            userId,
          })
          .select('project.id')
          .distinct(true)
          .getRawMany();

        const assignedProjects = await this.projectRepository
          .createQueryBuilder('project')
          .where('project.assignedFreelancerId = :userId', { userId })
          .select('project.id')
          .getRawMany();

        const messageIds = messageProjects.map((p) => p.project_id);
        const assignedIds = assignedProjects.map((p) => p.id);

        // Combine and remove duplicates
        projectIds = [...new Set([...messageIds, ...assignedIds])];
      }

      if (projectIds.length === 0) {
        return { success: true, data: [] };
      }

      // For each project, get the latest message
      const conversations = await Promise.all(
        projectIds.map(async (projectId) => {
          // Get the project details
          const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ['client', 'assignedFreelancer'],
          });

          if (!project) {
            return null;
          }

          // Get the latest message for this project where the user is either sender or receiver
          let latestMessage;

          if (userRole === 'client') {
            // For clients, get the latest message in the project
            latestMessage = await this.messageRepository.findOne({
              where: { project: { id: projectId } },
              relations: ['sender', 'project'],
              order: { createdAt: 'DESC' },
            });
          } else {
            // For freelancers, get the latest message where they are sender or receiver
            latestMessage = await this.messageRepository.findOne({
              where: [
                { project: { id: projectId }, sender: { id: userId } },
                { project: { id: projectId }, receiver: { id: userId } },
              ],
              relations: ['sender', 'project'],
              order: { createdAt: 'DESC' },
            });
          }

          if (latestMessage) {
            // Determine the other party in the conversation
            let otherPartyId, otherPartyName;

            if (userRole === 'client') {
              // For clients, the other party is the freelancer
              if (project.assignedFreelancer) {
                otherPartyId = project.assignedFreelancer.id;
                otherPartyName = project.assignedFreelancer.name;
              } else if (latestMessage.sender.id !== userId) {
                // If no assigned freelancer, use the sender of the latest message
                otherPartyId = latestMessage.sender.id;
                otherPartyName = latestMessage.sender.name;
              } else {
                // Fallback - use a placeholder
                otherPartyId = 0;
                otherPartyName = 'Freelancer';
              }
            } else {
              // For freelancers, the other party is the client
              otherPartyId = project.client.id;
              otherPartyName = project.client.name;
            }

            return {
              projectId,
              otherPartyId,
              otherPartyName,
              lastMessage: {
                id: latestMessage.id,
                message: latestMessage.message,
                createdAt: latestMessage.createdAt,
                sender: {
                  id: latestMessage.sender.id,
                  name: latestMessage.sender.name,
                },
                project: {
                  id: latestMessage.project.id,
                  title: latestMessage.project.title,
                  status: latestMessage.project.status,
                },
              },
            };
          }
          return null;
        }),
      );

      // Filter out any null values and sort by latest message
      const validConversations = conversations
        .filter((c) => c !== null)
        .sort(
          (a, b) =>
            new Date(b.lastMessage.createdAt).getTime() -
            new Date(a.lastMessage.createdAt).getTime(),
        );

      return { success: true, data: validConversations };
    } catch (error) {
      console.error('Error getting conversations:', error);
      return {
        success: false,
        message: 'Failed to retrieve conversations',
        error: error.message,
      };
    }
  }
}
