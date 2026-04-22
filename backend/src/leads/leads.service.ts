import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from '@prisma/client';
import { GetLeadsDto } from './dto/get-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    return await this.prisma.lead.create({
      data: createLeadDto,
    });
  }

  async findAll(query: GetLeadsDto) {
    const {
      page = 1,
      limit = 10,
      q,
      status,
      sort = 'createdAt',
      order = 'desc',
    } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(status && { status }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { email: { contains: q, mode: 'insensitive' as const } },
          { company: { contains: q, mode: 'insensitive' as const } },
        ],
      }),
    };
    const [items, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        take: Number(limit),
        skip: Number(skip),
        orderBy: [{ [sort]: order }, { createdAt: 'desc' }],
      }),
      this.prisma.lead.count({ where }),
    ]);
    return {
      items,
      total,
      page,
      lastPage: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { comments: true },
    });
    if (!lead) throw new NotFoundException(`Lead with ID ${id} not found`);
    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    try {
      return await this.prisma.lead.update({
        where: { id },
        data: updateLeadDto,
      });
    } catch {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<Lead> {
    try {
      return await this.prisma.lead.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
  }
}
