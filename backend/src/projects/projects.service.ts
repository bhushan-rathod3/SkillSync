import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { UsersService } from 'src/users/users.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private readonly usersService: UsersService,
  ) {}

  async createProject(
    createProjectDto: CreateProjectDto,
    clientId: number,
  ): Promise<Project> {
    const clientResponse = await this.usersService.findById(clientId);
    if (!clientResponse.success || !clientResponse.data) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const project = this.projectRepository.create(createProjectDto);
    project.client = clientResponse.data;
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['client'] });
  }

  async findById(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'assignedFreelancer'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async findByClientId(clientId: number): Promise<Project[]> {
    try {
      return this.projectRepository.find({
        where: { client: { id: clientId } },
        relations: ['client', 'assignedFreelancer', 'bids'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      // If ordering by createdAt fails (e.g., field doesn't exist in older records),
      // try without ordering
      return this.projectRepository.find({
        where: { client: { id: clientId } },
        relations: ['client', 'assignedFreelancer', 'bids'],
      });
    }
  }
}
