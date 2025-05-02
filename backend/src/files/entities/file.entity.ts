import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: 'uploaderId' })
  uploader: User;

  @Column({ nullable: true })
  uploaderId: number;

  @ManyToOne(() => Project, (project) => project.files)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ nullable: true })
  projectId: number;

  @Column()
  fileUrl: string;

  @Column()
  fileType: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
