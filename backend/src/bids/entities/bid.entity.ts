import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';

export enum BidStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.bids)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @RelationId((bid: Bid) => bid.project)
  projectId: number;

  @ManyToOne(() => User, (user) => user.bids)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: User;

  @RelationId((bid: Bid) => bid.freelancer)
  freelancerId: number;

  @Column()
  bidAmount: number;

  @Column()
  durationDays: number;

  @Column()
  bidMessage: string;

  @Column({
    type: 'enum',
    enum: BidStatus,
    default: BidStatus.PENDING,
  })
  status: BidStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
