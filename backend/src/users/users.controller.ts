import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Patch,
  UseInterceptors,
  UploadedFile,
  Param,
  Res,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    console.log('Request User:', req.user);
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, callback) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          callback(null, `profile-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const userId = req.user.id; // Extract user ID from the token

    // If a file was uploaded, add the filename to the DTO
    if (file) {
      updateUserDto.profileImage = file.filename;
      console.log('Profile image uploaded:', file.filename);
    }

    // Handle skills - they come as a JSON string from FormData
    if (updateUserDto.skills && typeof updateUserDto.skills === 'string') {
      try {
        // Parse the JSON string into an array
        updateUserDto.skills = JSON.parse(updateUserDto.skills);
        console.log('Parsed skills:', updateUserDto.skills);
      } catch (error) {
        console.error('Error parsing skills JSON:', error);
        // If parsing fails, set skills to empty array
        updateUserDto.skills = [];
      }
    }

    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-profile-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, callback) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          callback(null, `profile-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const userId = req.user.id;
    console.log('Uploading profile image:', file.filename);
    return this.usersService.updateProfileImage(userId, file.filename);
  }

  @Get('profile-image/:filename')
  getProfileImage(@Param('filename') filename: string, @Res() res: Response) {
    const path = join(process.cwd(), 'uploads/profiles', filename);
    console.log('Serving profile image from path:', path);
    return res.sendFile(path);
  }

  @Get('freelancers')
  getAllFreelancers() {
    console.log('Getting all freelancers');
    return this.usersService.findAllFreelancers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    console.log('Getting user by ID:', id);
    return this.usersService.findById(parseInt(id));
  }

  @Get('freelancers/search')
  searchFreelancers(@Query('query') query: string) {
    console.log('Searching freelancers with query:', query);
    return this.usersService.searchFreelancers(query);
  }
}
