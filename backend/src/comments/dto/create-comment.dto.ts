import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is a very important client' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  text!: string;
}
