import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { SkillsService } from 'src/skills/skills.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private skillsService: SkillsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Extract skills from the DTO
      const { skills, ...userUpdateData } = updateUserDto;

      // Update user data
      Object.assign(user, userUpdateData);
      const updatedUser = await this.usersRepository.save(user);

      // Update skills if provided
      if (skills && Array.isArray(skills)) {
        try {
          await this.skillsService.updateUserSkills(userId, skills);
          console.log('Skills updated successfully for user:', userId);
        } catch (skillError) {
          console.error('Error updating skills:', skillError);
          // Continue with the user update even if skills update fails
          return {
            success: true,
            message:
              'Profile updated successfully, but there was an issue updating skills',
            data: updatedUser,
            skillsError: skillError.message,
          };
        }
      }

      // Get updated user with skills
      const userSkills = await this.skillsService.getUserSkills(userId);

      return {
        success: true,
        message: 'Profile updated successfully',
        data: {
          ...updatedUser,
          skills: userSkills.map((skill) => skill.name),
        },
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: 'Failed to update profile',
        error: error.message,
      };
    }
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return {
        success: false,
        message: 'Failed to retrieve user',
        error: error.message,
      };
    }
  }

  async updateProfileImage(userId: number, filename: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.profileImage = filename;
    console.log('Updating user profile image to:', filename);
    return this.usersRepository.save(user);
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async findAllFreelancers() {
    try {
      const freelancers = await this.usersRepository.find({
        where: { role: UserRole.FREELANCER },
        select: ['id', 'name', 'email', 'bio', 'profileImage', 'role'],
        relations: ['userSkills', 'userSkills.skill'],
      });

      return {
        success: true,
        data: freelancers,
      };
    } catch (error) {
      console.error('Error finding freelancers:', error);
      return {
        success: false,
        message: 'Failed to retrieve freelancers',
        error: error.message,
      };
    }
  }

  async searchFreelancers(query: string) {
    try {
      // Create a query builder to search freelancers
      const queryBuilder = this.usersRepository.createQueryBuilder('user');

      // Filter by role
      queryBuilder.where('user.role = :role', { role: 'freelancer' });

      // Add search conditions if query is provided
      if (query && query.trim() !== '') {
        queryBuilder.andWhere('user.name LIKE :query', { query: `%${query}%` });
      }

      // Load relations
      queryBuilder
        .leftJoinAndSelect('user.userSkills', 'userSkills')
        .leftJoinAndSelect('userSkills.skill', 'skill');

      const freelancers = await queryBuilder.getMany();

      return {
        success: true,
        data: freelancers,
      };
    } catch (error) {
      console.error('Error searching freelancers:', error);
      return {
        success: false,
        message: 'Failed to search freelancers',
        error: error.message,
      };
    }
  }
}
