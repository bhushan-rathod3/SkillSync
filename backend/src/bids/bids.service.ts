import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Bid, BidStatus } from './entities/bid.entity';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { ApproveBidDto } from './dto/approve-bid.dto';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>, // Inject the Project repository
  ) {}

  async create(
    data: CreateBidDto,
    projectId: number,
    freelancerId: number,
  ): Promise<Bid> {
    // Validate that the project exists
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if project is still open
    if (project.status !== ProjectStatus.OPEN) {
      throw new BadRequestException('Cannot bid on a project that is not open');
    }

    // Create and save the bid
    const bid = this.bidRepository.create({
      bidAmount: data.bidAmount,
      durationDays: data.durationDays,
      bidMessage: data.bidMessage,
      project: { id: projectId },
      freelancer: { id: freelancerId },
      status: BidStatus.PENDING,
    });

    return this.bidRepository.save(bid);
  }

  async update(
    bidId: number,
    data: UpdateBidDto,
    freelancerId: number,
  ): Promise<Bid> {
    // Find the bid
    const bid = await this.bidRepository.findOne({
      where: { id: bidId },
      relations: ['freelancer', 'project'],
    });
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${bidId} not found`);
    }

    // Ensure the freelancer owns the bid
    if (bid.freelancer.id !== freelancerId) {
      throw new ForbiddenException('You are not authorized to update this bid');
    }

    // Check if bid can be updated (only pending bids can be updated)
    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestException(
        'Cannot update a bid that has been processed',
      );
    }

    // Check if project is still open
    if (bid.project.status !== ProjectStatus.OPEN) {
      throw new BadRequestException(
        'Cannot update a bid on a project that is not open',
      );
    }

    // Update the bid
    Object.assign(bid, data);
    return this.bidRepository.save(bid);
  }

  async findByProject(projectId: number): Promise<Bid[]> {
    // Check if the project exists
    const projectExists = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!projectExists) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Fetch bids for the project
    const bids = await this.bidRepository.find({
      where: { project: { id: projectId } },
      relations: ['freelancer'],
    });

    // Return the bids (empty array if no bids exist)
    return bids;
  }

  async approveBid(
    bidId: number,
    data: ApproveBidDto,
    clientId: number,
  ): Promise<Bid> {
    // Find the bid with project and freelancer relations
    const bid = await this.bidRepository.findOne({
      where: { id: bidId },
      relations: ['project', 'project.client', 'freelancer'],
    });

    if (!bid) {
      throw new NotFoundException(`Bid with ID ${bidId} not found`);
    }

    // Ensure the client owns the project
    if (bid.project.client.id !== clientId) {
      throw new ForbiddenException(
        'You are not authorized to approve this bid',
      );
    }

    // Check if project is still open
    if (bid.project.status !== ProjectStatus.OPEN) {
      throw new BadRequestException(
        'Cannot approve a bid on a project that is not open',
      );
    }

    // Update bid status
    bid.status = data.status;

    // If bid is approved, update project status and assign freelancer
    if (data.status === BidStatus.APPROVED) {
      // Update project status to ASSIGNED
      await this.projectRepository.update(
        { id: bid.project.id },
        {
          status: ProjectStatus.ASSIGNED,
          assignedFreelancer: { id: bid.freelancer.id },
        },
      );

      // Reject all other bids for this project
      await this.bidRepository.update(
        {
          project: { id: bid.project.id },
          id: Not(bid.id), // Not equal to the current bid
        },
        { status: BidStatus.REJECTED },
      );
    }

    // Save and return the updated bid
    return this.bidRepository.save(bid);
  }

  async findClientProjectBids(clientId: number): Promise<Bid[]> {
    // Find all bids for projects owned by the client
    const bids = await this.bidRepository
      .createQueryBuilder('bid')
      .innerJoinAndSelect('bid.project', 'project')
      .innerJoinAndSelect('bid.freelancer', 'freelancer')
      .innerJoin('project.client', 'client')
      .where('client.id = :clientId', { clientId })
      .getMany();

    return bids;
  }

  async findFreelancerBids(freelancerId: number): Promise<Bid[]> {
    // Find all bids submitted by the freelancer
    const bids = await this.bidRepository.find({
      where: { freelancer: { id: freelancerId } },
      relations: ['project', 'project.client'],
      order: { createdAt: 'DESC' }, // Most recent bids first
    });

    return bids;
  }
}
