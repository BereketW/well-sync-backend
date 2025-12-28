import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CurrentUserId } from '../auth/current-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import type { UserProfile, WellnessGoal } from './users.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import {
  CreateWellnessGoalDto,
  WellnessGoalDto,
} from './dto/wellness-goal.dto';

@ApiTags('Users')
@ApiBearerAuth('bearer')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOkResponse({
    type: UserProfileDto,
    schema: {
      example: {
        id: 'u-1000',
        name: 'Alex Doe',
        email: 'alex.doe@example.com',
        timezone: 'UTC+03:00',
        focusAreas: ['stress-management', 'nutrition'],
        preferences: {
          notificationChannel: 'email',
          highLevelGoals: ['Improve sleep quality', 'Increase mindfulness'],
        },
      },
    },
  })
  async getProfile(@CurrentUserId() userId: string): Promise<UserProfileDto> {
    return this.usersService.getProfile(userId);
  }

  @Put('profile')
  @ApiBody({
    type: UpdateUserProfileDto,
    examples: {
      sample: {
        summary: 'Update user profile',
        value: {
          name: 'Updated User',
          focusAreas: ['sleep'],
          preferences: {
            notificationChannel: 'push',
            highLevelGoals: ['Increase mindfulness'],
          },
        },
      },
    },
  })
  @ApiOkResponse({
    type: UserProfileDto,
    schema: {
      example: {
        id: 'u-1000',
        name: 'Updated User',
        email: 'alex.doe@example.com',
        timezone: 'UTC+03:00',
        focusAreas: ['sleep'],
        preferences: {
          notificationChannel: 'push',
          highLevelGoals: ['Increase mindfulness'],
        },
      },
    },
  })
  async updateProfile(
    @CurrentUserId() userId: string,
    @Body() update: UpdateUserProfileDto,
  ): Promise<UserProfileDto> {
    return this.usersService.updateProfile(
      userId,
      update as Partial<UserProfile>,
    );
  }

  @Get('goals')
  @ApiOkResponse({
    type: [WellnessGoalDto],
    schema: {
      example: [
        {
          id: 'goal-1',
          title: 'Morning Stretch Routine',
          category: 'fitness',
          targetMetric: 'minutes',
          targetValue: '15',
          cadence: 'daily',
        },
      ],
    },
  })
  async listGoals(@CurrentUserId() userId: string): Promise<WellnessGoalDto[]> {
    return this.usersService.listGoals(userId);
  }

  @Post('goals')
  @ApiBody({
    type: CreateWellnessGoalDto,
    examples: {
      sample: {
        summary: 'Create a wellness goal',
        value: {
          title: 'Hydration Habit',
          category: 'nutrition',
          targetMetric: 'liters',
          targetValue: '2',
          cadence: 'daily',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: WellnessGoalDto,
    schema: {
      example: {
        id: 'goal-3',
        title: 'Hydration Habit',
        category: 'nutrition',
        targetMetric: 'liters',
        targetValue: '2',
        cadence: 'daily',
      },
    },
  })
  async addGoal(
    @CurrentUserId() userId: string,
    @Body() goal: CreateWellnessGoalDto,
  ): Promise<WellnessGoalDto> {
    return this.usersService.addGoal(userId, goal as Omit<WellnessGoal, 'id'>);
  }
}
