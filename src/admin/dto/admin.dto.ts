import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminUserSummaryDto {
  @ApiProperty({ example: 'u-1000' })
  id!: string;

  @ApiProperty({ example: 'alex.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'user', enum: ['user', 'coach', 'admin'] })
  role!: 'user' | 'coach' | 'admin';

  @ApiProperty({ example: 'active', enum: ['active', 'suspended'] })
  status!: 'active' | 'suspended';
}

export class KnowledgeSourceDto {
  @ApiProperty({ example: 'source-1' })
  id!: string;

  @ApiProperty({ example: 'Mindfulness-Based Stress Reduction Clinical Trial' })
  title!: string;

  @ApiProperty({
    example: 'peer_reviewed',
    enum: ['whitepaper', 'peer_reviewed', 'blog', 'dataset'],
  })
  type!: 'whitepaper' | 'peer_reviewed' | 'blog' | 'dataset';

  @ApiProperty({ example: 'https://example.com/mindfulness-trial' })
  url!: string;

  @ApiProperty({ example: '2025-01-05T10:15:00.000Z' })
  lastValidated!: string;
}

export class CreateKnowledgeSourceDto {
  @ApiProperty({ example: 'Test Source' })
  title!: string;

  @ApiProperty({
    example: 'blog',
    enum: ['whitepaper', 'peer_reviewed', 'blog', 'dataset'],
  })
  type!: 'whitepaper' | 'peer_reviewed' | 'blog' | 'dataset';

  @ApiProperty({ example: 'https://example.com' })
  url!: string;

  @ApiProperty({ example: '2025-12-27T10:00:00.000Z' })
  lastValidated!: string;
}

export class AuditLogEntryDto {
  @ApiProperty({ example: 'log-1' })
  id!: string;

  @ApiProperty({ example: '2025-01-12T09:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: 'u-3000' })
  actor!: string;

  @ApiProperty({ example: 'Updated AI safety checklist' })
  action!: string;

  @ApiProperty({ example: 'safety-pipeline' })
  target!: string;

  @ApiPropertyOptional({
    example:
      'Ensured non-diagnostic disclaimers are present for mental wellness prompts.',
  })
  notes?: string;
}
