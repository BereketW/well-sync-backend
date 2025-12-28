import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WellnessInputDto {
  @ApiProperty({ example: 'wellness-1' })
  id!: string;

  @ApiProperty({ example: '2025-12-27T10:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({
    example: 'sleep',
    enum: ['sleep', 'nutrition', 'activity', 'mood', 'stress'],
  })
  category!: 'sleep' | 'nutrition' | 'activity' | 'mood' | 'stress';

  @ApiProperty({ example: 'Slept well and woke up rested.' })
  summary!: string;

  @ApiProperty({
    example: { hours: 7, quality: 'good' },
    additionalProperties: true,
  })
  metrics!: Record<string, number | string>;

  @ApiPropertyOptional({ example: 'Avoided caffeine after 2pm.' })
  notes?: string;
}

export class CreateWellnessInputDto {
  @ApiProperty({ example: '2025-12-27T10:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({
    example: 'sleep',
    enum: ['sleep', 'nutrition', 'activity', 'mood', 'stress'],
  })
  category!: 'sleep' | 'nutrition' | 'activity' | 'mood' | 'stress';

  @ApiProperty({ example: 'Slept well and woke up rested.' })
  summary!: string;

  @ApiProperty({
    example: { hours: 7, quality: 'good' },
    additionalProperties: true,
  })
  metrics!: Record<string, number | string>;

  @ApiPropertyOptional({ example: 'Avoided caffeine after 2pm.' })
  notes?: string;
}
