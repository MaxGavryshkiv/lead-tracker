import { Module } from '@nestjs/common';
import { LeadsModule } from './leads/leads.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [LeadsModule, CommentsModule],
})
export class AppModule {}
