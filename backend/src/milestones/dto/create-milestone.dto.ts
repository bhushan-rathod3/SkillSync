import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMilestoneDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  dueDate: Date;

  @IsNumber()
  amount: number;
}
