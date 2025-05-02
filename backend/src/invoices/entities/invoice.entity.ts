import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Milestone } from 'src/milestones/entities/milestone.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Milestone, (milestone) => milestone.invoice)
  @JoinColumn()
  milestone: Milestone;

  @Column()
  invoiceNumber: string;

  @Column()
  amount: number;

  @Column({ default: 'unpaid' }) // paid, unpaid
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
