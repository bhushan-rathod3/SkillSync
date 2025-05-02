import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}
