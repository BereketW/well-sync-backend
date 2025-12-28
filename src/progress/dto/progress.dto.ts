import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProgressInsightDto {
  @ApiProperty({ example: '2025-W01' })
  week!: string;

  @ApiProperty({ example: 78 })
  engagementScore!: number;

  @ApiProperty({
    example:
      'Consistent morning journaling correlated with lower stress markers.',
  })
  highlightedTrend!: string;
}

export class MilestonePayloadDto {
  @ApiProperty({ example: 'Completed week 1' })
  title!: string;

  @ApiProperty({ example: '2025-12-27T10:00:00.000Z' })
  achievedOn!: string;

  @ApiPropertyOptional({ example: 'Felt more consistent with journaling.' })
  notes?: string;
}

export class MilestoneRecordDto extends MilestonePayloadDto {
  @ApiProperty({ example: 'milestone-1' })
  id!: string;
}

export class TipDto {
  @ApiProperty({ example: 'tip-1' })
  id!: string;

  @ApiProperty({
    example:
      'Schedule a Sunday reflection to celebrate wins and reset intentions for the week.',
  })
  message!: string;

  @ApiProperty({
    example: 'motivation',
    enum: ['motivation', 'accountability', 'wellness'],
  })
  category!: 'motivation' | 'accountability' | 'wellness';
}
