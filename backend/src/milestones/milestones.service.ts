import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from './entities/milestone.entity';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
  ) {}

  async create(data: Partial<Milestone>): Promise<Milestone> {
    const milestone = this.milestoneRepository.create(data);
    return this.milestoneRepository.save(milestone);
  }

  async findByProject(projectId: number): Promise<Milestone[]> {
    return this.milestoneRepository.find({
      where: { project: { id: projectId } },
    });
  }
}
