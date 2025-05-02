import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  milestoneId: number;
}
