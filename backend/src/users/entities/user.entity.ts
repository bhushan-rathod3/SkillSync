import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Project } from 'src/projects/entities/project.entity';
import { Bid } from 'src/bids/entities/bid.entity';
import { Message } from 'src/messages/entities/message.entity';
import { File } from 'src/files/entities/file.entity';
import { UserSkill } from 'src/skills/entities/user-skill.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  CLIENT = 'client',
  FREELANCER = 'freelancer',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true, default: 'default-user.jpg' })
  profileImage: string;

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];

  @OneToMany(() => Bid, (bid) => bid.freelancer)
  bids: Bid[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => File, (file) => file.uploader)
  files: File[];

  @OneToMany(() => UserSkill, (userSkill) => userSkill.user)
  userSkills: UserSkill[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
