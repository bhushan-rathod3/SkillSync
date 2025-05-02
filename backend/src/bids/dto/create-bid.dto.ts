import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  bidAmount: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  durationDays: number;

  @IsOptional()
  @IsString()
  bidMessage?: string;
}
