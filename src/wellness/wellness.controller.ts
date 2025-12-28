import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUserId } from '../auth/current-user.decorator';
import { WellnessService } from './wellness.service';
import type { WellnessInput } from './wellness.service';
import {
  CreateWellnessInputDto,
  WellnessInputDto,
} from './dto/wellness-input.dto';

@ApiTags('Wellness')
@ApiBearerAuth('bearer')
@Controller('wellness/inputs')
export class WellnessController {
  constructor(private readonly wellnessService: WellnessService) {}

  @Get()
  @ApiOkResponse({
    type: [WellnessInputDto],
    schema: {
      example: [
        {
          id: 'wellness-1',
          timestamp: '2025-12-27T10:00:00.000Z',
          category: 'sleep',
          summary: 'Slept well and woke up rested.',
          metrics: { hours: 7, quality: 'good' },
          notes: 'Avoided caffeine after 2pm.',
        },
      ],
    },
  })
  async listInputs(
    @CurrentUserId() userId: string,
  ): Promise<WellnessInputDto[]> {
    return this.wellnessService.listInputs(userId);
  }

  @Post()
  @ApiBody({
    type: CreateWellnessInputDto,
    examples: {
      sample: {
        summary: 'Create a wellness input',
        value: {
          timestamp: '2025-12-27T10:00:00.000Z',
          category: 'sleep',
          summary: 'Slept well and woke up rested.',
          metrics: { hours: 7, quality: 'good' },
          notes: 'Avoided caffeine after 2pm.',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: WellnessInputDto,
    schema: {
      example: {
        id: 'wellness-1',
        timestamp: '2025-12-27T10:00:00.000Z',
        category: 'sleep',
        summary: 'Slept well and woke up rested.',
        metrics: { hours: 7, quality: 'good' },
        notes: 'Avoided caffeine after 2pm.',
      },
    },
  })
  async createInput(
    @CurrentUserId() userId: string,
    @Body() payload: CreateWellnessInputDto,
  ): Promise<WellnessInputDto> {
    return this.wellnessService.createInput(
      userId,
      payload as Omit<WellnessInput, 'id'>,
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 'wellness-1' })
  @ApiOkResponse({
    type: WellnessInputDto,
    schema: {
      example: {
        id: 'wellness-1',
        timestamp: '2025-12-27T10:00:00.000Z',
        category: 'sleep',
        summary: 'Slept well and woke up rested.',
        metrics: { hours: 7, quality: 'good' },
        notes: 'Avoided caffeine after 2pm.',
      },
    },
  })
  async getInput(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<WellnessInputDto> {
    return this.wellnessService.getInputById(userId, id);
  }
}
