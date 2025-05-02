import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  async create(@Req() req, @Body() createProjectDto: CreateProjectDto) {
    const clientId = req.user['id'];
    return this.projectsService.createProject(createProjectDto, clientId);
  }

  @Get('client/my-projects')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  findClientProjects(@Req() req) {
    const clientId = req.user['id'];
    return this.projectsService.findByClientId(clientId);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.projectsService.findById(id);
  }
}
