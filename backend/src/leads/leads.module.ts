import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { PrismaService } from 'src/prisma.service';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [CommentsModule],
  controllers: [LeadsController],
  providers: [LeadsService, PrismaService],
})
export class LeadsModule {}
