import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { Milestone } from 'src/milestones/entities/milestone.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Milestone)
    private milestoneRepository: Repository<Milestone>,
  ) {}

  async create(data: Partial<Invoice>): Promise<Invoice> {
    // If creating from a milestone, verify the milestone exists
    if (data.milestone && data.milestone.id) {
      const milestone = await this.milestoneRepository.findOne({
        where: { id: data.milestone.id },
      });

      if (!milestone) {
        throw new NotFoundException(
          `Milestone with ID ${data.milestone.id} not found`,
        );
      }
    }

    const invoice = this.invoiceRepository.create(data);
    return this.invoiceRepository.save(invoice);
  }

  async findAll(userId: number, userRole: string): Promise<Invoice[]> {
    if (userRole === UserRole.CLIENT) {
      // For clients, find all invoices related to their projects
      const invoices = await this.invoiceRepository.find({
        relations: [
          'milestone',
          'milestone.project',
          'milestone.project.client',
        ],
        order: { createdAt: 'DESC' },
      });

      // Filter invoices where the client is the user
      return invoices.filter(
        (invoice) => invoice.milestone?.project?.client?.id === userId,
      );
    } else if (userRole === UserRole.FREELANCER) {
      // For freelancers, find all invoices related to projects they're assigned to
      const invoices = await this.invoiceRepository.find({
        relations: [
          'milestone',
          'milestone.project',
          'milestone.project.assignedFreelancer',
        ],
        order: { createdAt: 'DESC' },
      });

      // Filter invoices where the assigned freelancer is the user
      return invoices.filter(
        (invoice) =>
          invoice.milestone?.project?.assignedFreelancer?.id === userId,
      );
    }

    return [];
  }

  async findOne(
    id: number,
    userId: number,
    userRole: string,
  ): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: [
        'milestone',
        'milestone.project',
        'milestone.project.client',
        'milestone.project.assignedFreelancer',
      ],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    // Check if the user has access to this invoice
    if (
      userRole === UserRole.CLIENT &&
      invoice.milestone.project.client.id !== userId
    ) {
      throw new ForbiddenException('You do not have access to this invoice');
    } else if (
      userRole === UserRole.FREELANCER &&
      invoice.milestone.project.assignedFreelancer.id !== userId
    ) {
      throw new ForbiddenException('You do not have access to this invoice');
    }

    return invoice;
  }

  async markAsPaid(id: number, clientId: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['milestone', 'milestone.project', 'milestone.project.client'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    // Verify the client owns the project
    if (invoice.milestone.project.client.id !== clientId) {
      throw new ForbiddenException(
        'You do not have permission to mark this invoice as paid',
      );
    }

    // Update the invoice status
    invoice.status = 'paid';

    // Also update the milestone
    const milestone = invoice.milestone;
    milestone.isPaid = true;
    await this.milestoneRepository.save(milestone);

    return this.invoiceRepository.save(invoice);
  }
}
