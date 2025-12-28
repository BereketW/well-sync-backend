import { ApiProperty } from '@nestjs/swagger';

export class WellnessGoalDto {
  @ApiProperty({ example: 'goal-1' })
  id!: string;

  @ApiProperty({ example: 'Morning Stretch Routine' })
  title!: string;

  @ApiProperty({
    example: 'fitness',
    enum: ['fitness', 'nutrition', 'mental_wellness', 'sleep', 'other'],
  })
  category!: 'fitness' | 'nutrition' | 'mental_wellness' | 'sleep' | 'other';

  @ApiProperty({ example: 'minutes' })
  targetMetric!: string;

  @ApiProperty({ example: '15' })
  targetValue!: string;

  @ApiProperty({ example: 'daily', enum: ['daily', 'weekly', 'monthly'] })
  cadence!: 'daily' | 'weekly' | 'monthly';
}

export class CreateWellnessGoalDto {
  @ApiProperty({ example: 'Hydration Habit' })
  title!: string;

  @ApiProperty({
    example: 'nutrition',
    enum: ['fitness', 'nutrition', 'mental_wellness', 'sleep', 'other'],
  })
  category!: 'fitness' | 'nutrition' | 'mental_wellness' | 'sleep' | 'other';

  @ApiProperty({ example: 'liters' })
  targetMetric!: string;

  @ApiProperty({ example: '2' })
  targetValue!: string;

  @ApiProperty({ example: 'daily', enum: ['daily', 'weekly', 'monthly'] })
  cadence!: 'daily' | 'weekly' | 'monthly';
}
