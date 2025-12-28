import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface WellnessInput {
  id: string;
  timestamp: string;
  category: 'sleep' | 'nutrition' | 'activity' | 'mood' | 'stress';
  summary: string;
  metrics: Record<string, number | string>;
  notes?: string;
}

@Injectable()
export class WellnessService {
  constructor(private readonly prisma: PrismaService) {}

  async listInputs(userId: string): Promise<WellnessInput[]> {
    const inputs = await this.prisma.wellnessInput.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });

    return inputs.map((input) => ({
      id: input.id,
      timestamp: input.timestamp.toISOString(),
      category: input.category as WellnessInput['category'],
      summary: input.summary,
      metrics: input.metrics as Record<string, number | string>,
      notes: input.notes ?? undefined,
    }));
  }

  async createInput(
    userId: string,
    payload: Omit<WellnessInput, 'id'>,
  ): Promise<WellnessInput> {
    const newInput = await this.prisma.wellnessInput.create({
      data: {
        timestamp: new Date(payload.timestamp),
        category: payload.category,
        summary: payload.summary,
        metrics: payload.metrics,
        notes: payload.notes,
        userId,
      },
    });

    return {
      id: newInput.id,
      timestamp: newInput.timestamp.toISOString(),
      category: newInput.category as WellnessInput['category'],
      summary: newInput.summary,
      metrics: newInput.metrics as Record<string, number | string>,
      notes: newInput.notes ?? undefined,
    };
  }

  async getInputById(userId: string, id: string): Promise<WellnessInput> {
    const input = await this.prisma.wellnessInput.findFirst({
      where: { id, userId },
    });

    if (!input) {
      throw new NotFoundException(
        `Wellness input with id '${id}' was not found.`,
      );
    }

    return {
      id: input.id,
      timestamp: input.timestamp.toISOString(),
      category: input.category as WellnessInput['category'],
      summary: input.summary,
      metrics: input.metrics as Record<string, number | string>,
      notes: input.notes ?? undefined,
    };
  }
}
