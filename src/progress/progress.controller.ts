import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUserId } from '../auth/current-user.decorator';
import { ProgressService } from './progress.service';
import type { MilestonePayload } from './progress.service';
import {
  MilestonePayloadDto,
  MilestoneRecordDto,
  ProgressInsightDto,
  TipDto,
} from './dto/progress.dto';

@ApiTags('Progress')
@ApiBearerAuth('bearer')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOkResponse({
    type: [ProgressInsightDto],
    schema: {
      example: [
        {
          week: '2025-W01',
          engagementScore: 78,
          highlightedTrend:
            'Consistent morning journaling correlated with lower stress markers.',
        },
      ],
    },
  })
  async listInsights(
    @CurrentUserId() userId: string,
  ): Promise<ProgressInsightDto[]> {
    return this.progressService.listInsights(userId);
  }

  @Post('milestones')
  @ApiBody({
    type: MilestonePayloadDto,
    examples: {
      sample: {
        summary: 'Create milestone',
        value: {
          title: 'Completed week 1',
          achievedOn: '2025-12-27T10:00:00.000Z',
          notes: 'Felt more consistent with journaling.',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: MilestoneRecordDto,
    schema: {
      example: {
        id: 'milestone-1',
        title: 'Completed week 1',
        achievedOn: '2025-12-27T10:00:00.000Z',
        notes: 'Felt more consistent with journaling.',
      },
    },
  })
  async createMilestone(
    @CurrentUserId() userId: string,
    @Body() payload: MilestonePayloadDto,
  ): Promise<MilestoneRecordDto> {
    return this.progressService.addMilestone(
      userId,
      payload as MilestonePayload,
    );
  }

  @Get('tips')
  @ApiOkResponse({
    type: [TipDto],
    schema: {
      example: [
        {
          id: 'tip-1',
          message:
            'Schedule a Sunday reflection to celebrate wins and reset intentions for the week.',
          category: 'motivation',
        },
      ],
    },
  })
  async listTips(): Promise<TipDto[]> {
    return this.progressService.listTips();
  }
}
