import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { UserSkill } from './entities/user-skill.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
    @InjectRepository(UserSkill)
    private userSkillRepository: Repository<UserSkill>,
  ) {}

  async create(name: string): Promise<Skill> {
    const skill = this.skillsRepository.create({ name });
    return this.skillsRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return this.skillsRepository.find();
  }

  async findOrCreateSkills(skillNames: string[]): Promise<Skill[]> {
    // Find existing skills
    const existingSkills = await this.skillsRepository.find({
      where: { name: In(skillNames) },
    });

    // Identify which skill names don't exist yet
    const existingSkillNames = existingSkills.map((skill) => skill.name);
    const newSkillNames = skillNames.filter(
      (name) => !existingSkillNames.includes(name),
    );

    // Create new skills if needed
    const newSkills: Skill[] = [];
    for (const name of newSkillNames) {
      const skill = this.skillsRepository.create({ name });
      newSkills.push(await this.skillsRepository.save(skill));
    }

    // Return all skills (existing + newly created)
    return [...existingSkills, ...newSkills];
  }

  async updateUserSkills(userId: number, skillNames: string[]): Promise<void> {
    try {
      // Get or create all skills
      const skills = await this.findOrCreateSkills(skillNames);

      // Remove existing user skills
      await this.userSkillRepository.delete({ user: { id: userId } });

      // Create new user skills
      const userSkills = skills.map((skill) => {
        return this.userSkillRepository.create({
          user: { id: userId },
          skill: { id: skill.id },
        });
      });

      // Save all user skills
      await this.userSkillRepository.save(userSkills);
    } catch (error) {
      console.error('Error updating user skills:', error);
      throw error;
    }
  }

  async getUserSkills(userId: number): Promise<Skill[]> {
    const userSkills = await this.userSkillRepository.find({
      where: { user: { id: userId } },
      relations: ['skill'],
    });

    return userSkills.map((userSkill) => userSkill.skill);
  }
}
