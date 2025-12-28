import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  timezone: string;
  focusAreas: string[];
  preferences: {
    notificationChannel: 'email' | 'sms' | 'push';
    highLevelGoals: string[];
  };
}

export interface WellnessGoal {
  id: string;
  title: string;
  category: 'fitness' | 'nutrition' | 'mental_wellness' | 'sleep' | 'other';
  targetMetric: string;
  targetValue: string;
  cadence: 'daily' | 'weekly' | 'monthly';
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string): Promise<UserProfile> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      timezone: user.timezone,
      focusAreas: user.focusAreas,
      preferences: {
        notificationChannel: user.notificationChannel,
        highLevelGoals: user.highLevelGoals,
      },
    };
  }

  async updateProfile(
    userId: string,
    update: Partial<UserProfile>,
  ): Promise<UserProfile> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(update.name && { name: update.name }),
        ...(update.email && { email: update.email }),
        ...(update.timezone && { timezone: update.timezone }),
        ...(update.focusAreas && { focusAreas: update.focusAreas }),
        ...(update.preferences?.notificationChannel && {
          notificationChannel: update.preferences.notificationChannel,
        }),
        ...(update.preferences?.highLevelGoals && {
          highLevelGoals: update.preferences.highLevelGoals,
        }),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      timezone: user.timezone,
      focusAreas: user.focusAreas,
      preferences: {
        notificationChannel: user.notificationChannel,
        highLevelGoals: user.highLevelGoals,
      },
    };
  }

  async listGoals(userId: string): Promise<WellnessGoal[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const goals = await this.prisma.wellnessGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return goals.map((goal) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      id: goal.id,
      title: goal.title,
      category: goal.category,
      targetMetric: goal.targetMetric,
      targetValue: goal.targetValue,
      cadence: goal.cadence,
    }));
  }

  async addGoal(
    userId: string,
    goal: Omit<WellnessGoal, 'id'>,
  ): Promise<WellnessGoal> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const newGoal = await this.prisma.wellnessGoal.create({
      data: {
        title: goal.title,
        category: goal.category,
        targetMetric: goal.targetMetric,
        targetValue: goal.targetValue,
        cadence: goal.cadence,
        userId,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return {
      id: newGoal.id,
      title: newGoal.title,
      category: newGoal.category,
      targetMetric: newGoal.targetMetric,
      targetValue: newGoal.targetValue,
      cadence: newGoal.cadence,
    };
  }
}
