import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { Project } from 'src/projects/entities/project.entity';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async upload(
    file: Express.Multer.File,
    projectId: number,
    uploaderId: number,
  ): Promise<File> {
    // Verify the project exists and the user has access to it
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'assignedFreelancer'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if the user is either the client or the assigned freelancer
    if (
      project.client.id !== uploaderId &&
      (!project.assignedFreelancer ||
        project.assignedFreelancer.id !== uploaderId)
    ) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const newFile = this.fileRepository.create({
      fileUrl: file.filename,
      fileType: file.mimetype,
      projectId: projectId,
      uploaderId: uploaderId,
    });
    return this.fileRepository.save(newFile);
  }

  async findByProject(
    projectId: number,
    userId: number,
    userRole: string,
  ): Promise<File[]> {
    // Verify the project exists and the user has access to it
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'assignedFreelancer'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if the user is either the client or the assigned freelancer
    if (userRole === UserRole.CLIENT) {
      if (project.client.id !== userId) {
        throw new ForbiddenException('You do not have access to this project');
      }
    } else if (userRole === UserRole.FREELANCER) {
      if (
        !project.assignedFreelancer ||
        project.assignedFreelancer.id !== userId
      ) {
        throw new ForbiddenException('You do not have access to this project');
      }
    }

    return this.fileRepository.find({
      where: { projectId: projectId },
      relations: ['uploader', 'project'],
      order: { createdAt: 'DESC' },
    });
  }
}
