import { IsEnum } from 'class-validator';
import { BidStatus } from '../entities/bid.entity';

export class ApproveBidDto {
  @IsEnum(BidStatus)
  status: BidStatus;
}
