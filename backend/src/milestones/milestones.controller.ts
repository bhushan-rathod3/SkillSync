import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { MilestonesService } from './milestones.service';

@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  create(@Body() body: any) {
    return this.milestonesService.create(body);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: number) {
    return this.milestonesService.findByProject(projectId);
  }
}
