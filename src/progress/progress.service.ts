import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ProgressInsight {
  week: string;
  engagementScore: number;
  highlightedTrend: string;
}

export interface MilestonePayload {
  title: string;
  achievedOn: string;
  notes?: string;
}

export interface MilestoneRecord extends MilestonePayload {
  id: string;
}

export interface Tip {
  id: string;
  message: string;
  category: 'motivation' | 'accountability' | 'wellness';
}

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async listInsights(userId: string): Promise<ProgressInsight[]> {
    const insights = await this.prisma.progressInsight.findMany({
      where: { userId },
      orderBy: { week: 'desc' },
    });

    return insights.map((insight) => ({
      week: insight.week,
      engagementScore: insight.engagementScore,
      highlightedTrend: insight.highlightedTrend,
    }));
  }

  async addMilestone(
    userId: string,
    payload: MilestonePayload,
  ): Promise<MilestoneRecord> {
    const milestone = await this.prisma.progressMilestone.create({
      data: {
        title: payload.title,
        achievedOn: new Date(payload.achievedOn),
        notes: payload.notes,
        userId,
      },
    });

    return {
      id: milestone.id,
      title: milestone.title,
      achievedOn: milestone.achievedOn.toISOString(),
      notes: milestone.notes ?? undefined,
    };
  }

  async listTips(): Promise<Tip[]> {
    const tips = await this.prisma.progressTip.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return tips.map((tip) => ({
      id: tip.id,
      message: tip.message,
      category: tip.category as Tip['category'],
    }));
  }
}
