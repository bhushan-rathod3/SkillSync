import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Bid } from 'src/bids/entities/bid.entity';
import { Milestone } from 'src/milestones/entities/milestone.entity';
import { Message } from 'src/messages/entities/message.entity';
import { File } from 'src/files/entities/file.entity';

export enum ProjectStatus {
  OPEN = 'open',
  ASSIGNED = 'assigned',
  COMPLETED = 'completed',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @ManyToOne(() => User, { nullable: true })
  assignedFreelancer: User;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  budget: number;

  @Column()
  deadline: Date;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.OPEN,
  })
  status: string;

  @OneToMany(() => Bid, (bid) => bid.project)
  bids: Bid[];

  @OneToMany(() => Milestone, (milestone) => milestone.project)
  milestones: Milestone[];

  @OneToMany(() => Message, (message) => message.project)
  messages: Message[];

  @OneToMany(() => File, (file) => file.project)
  files: File[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
