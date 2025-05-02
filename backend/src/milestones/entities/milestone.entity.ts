import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';

@Entity('milestones')
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.milestones)
  project: Project;

  @Column()
  title: string;

  @Column()
  dueDate: Date;

  @Column()
  amount: number;

  @Column({ default: false })
  isPaid: boolean;

  @OneToOne(() => Invoice, (invoice) => invoice.milestone)
  invoice: Invoice;
}
