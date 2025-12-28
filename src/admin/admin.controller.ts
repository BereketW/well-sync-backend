import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';
import type { KnowledgeSource } from './admin.service';
import {
  AdminUserSummaryDto,
  AuditLogEntryDto,
  CreateKnowledgeSourceDto,
  KnowledgeSourceDto,
} from './dto/admin.dto';

@ApiTags('Admin')
@ApiBearerAuth('bearer')
@Controller('admin')
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOkResponse({
    type: [AdminUserSummaryDto],
    schema: {
      example: [
        {
          id: 'u-1000',
          email: 'alex.doe@example.com',
          role: 'user',
          status: 'active',
        },
      ],
    },
  })
  async listUsers(): Promise<AdminUserSummaryDto[]> {
    return this.adminService.listUsers();
  }

  @Post('ai/sources')
  @ApiBody({
    type: CreateKnowledgeSourceDto,
    examples: {
      sample: {
        summary: 'Add a knowledge source',
        value: {
          title: 'Test Source',
          type: 'blog',
          url: 'https://example.com',
          lastValidated: '2025-12-27T10:00:00.000Z',
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: KnowledgeSourceDto,
    schema: {
      example: {
        id: 'source-2',
        title: 'Test Source',
        type: 'blog',
        url: 'https://example.com',
        lastValidated: '2025-12-27T10:00:00.000Z',
      },
    },
  })
  async addSource(
    @Body() payload: CreateKnowledgeSourceDto,
  ): Promise<KnowledgeSourceDto> {
    return this.adminService.addKnowledgeSource(
      payload as Omit<KnowledgeSource, 'id'>,
    );
  }

  @Get('logs')
  @ApiOkResponse({
    type: [AuditLogEntryDto],
    schema: {
      example: [
        {
          id: 'log-1',
          timestamp: '2025-01-12T09:00:00.000Z',
          actor: 'u-3000',
          action: 'Updated AI safety checklist',
          target: 'safety-pipeline',
          notes:
            'Ensured non-diagnostic disclaimers are present for mental wellness prompts.',
        },
      ],
    },
  })
  async listLogs(): Promise<AuditLogEntryDto[]> {
    return this.adminService.listLogs();
  }
}
