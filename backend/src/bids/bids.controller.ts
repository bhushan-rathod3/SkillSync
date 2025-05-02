import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateBidDto } from './dto/create-bid.dto';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateBidDto } from './dto/update-bid.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApproveBidDto } from './dto/approve-bid.dto';

@Controller('bids')
@UseGuards(JwtAuthGuard)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post('project/:projectId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.FREELANCER)
  async create(
    @Param('projectId') projectId: number,
    @Body() createBidDto: CreateBidDto,
    @Req() req,
  ) {
    const freelancerId = req.user.id;
    return this.bidsService.create(createBidDto, projectId, freelancerId);
  }

  @Patch(':bidId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.FREELANCER) // Only freelancers can update bids
  async update(
    @Param('bidId') bidId: number,
    @Body() updateBidDto: UpdateBidDto,
    @Req() req,
  ) {
    const freelancerId = req.user.id; // Extract freelancer ID from token
    return this.bidsService.update(bidId, updateBidDto, freelancerId);
  }

  @Patch(':bidId/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT) // Only clients can approve bids
  async approveBid(
    @Param('bidId') bidId: number,
    @Body() approveBidDto: ApproveBidDto,
    @Req() req,
  ) {
    const clientId = req.user.id; // Extract client ID from token
    return this.bidsService.approveBid(bidId, approveBidDto, clientId);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: number) {
    return this.bidsService.findByProject(projectId);
  }

  @Get('client/projects')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  findClientProjectBids(@Req() req) {
    const clientId = req.user.id;
    return this.bidsService.findClientProjectBids(clientId);
  }

  @Get('my-bids')
  @UseGuards(RolesGuard)
  @Roles(UserRole.FREELANCER)
  findFreelancerBids(@Req() req) {
    const freelancerId = req.user.id;
    return this.bidsService.findFreelancerBids(freelancerId);
  }
}
