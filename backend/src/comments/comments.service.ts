import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(leadId: string, createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        text: createCommentDto.text,
        leadId,
      },
    });
  }

  async findByLead(leadId: string) {
    return this.prisma.comment.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
