import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNumber,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeadStatus } from '@prisma/client';

export class CreateLeadDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Tech Corp', required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ enum: LeadStatus, default: LeadStatus.NEW })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiProperty({ example: 1000, required: false })
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiProperty({ example: 'Some notes about the lead', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
