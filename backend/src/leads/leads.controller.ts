import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { GetLeadsDto } from './dto/get-lead.dto';

@ApiTags('leads')
@Controller('api/leads')
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiResponse({
    status: 201,
    description: 'The lead has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Leads found.' })
  @ApiResponse({ status: 404, description: 'Leads not found.' })
  findAll(@Query() query: GetLeadsDto) {
    return this.leadsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by id' })
  @ApiResponse({ status: 200, description: 'Lead found.' })
  @ApiResponse({ status: 404, description: 'Lead not found.' })
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lead by id' })
  @ApiResponse({
    status: 201,
    description: 'The lead has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead by id' })
  @ApiResponse({ status: 200, description: 'The lead deleted.' })
  @ApiResponse({ status: 404, description: 'The lead not found.' })
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments on the lead' })
  @ApiResponse({ status: 200, description: 'Comments found.' })
  @ApiResponse({ status: 404, description: 'Comments not found.' })
  async getComments(@Param('id') id: string) {
    await this.leadsService.findOne(id);
    return this.commentsService.findByLead(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to the lead' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    await this.leadsService.findOne(id);
    return this.commentsService.create(id, createCommentDto);
  }
}
