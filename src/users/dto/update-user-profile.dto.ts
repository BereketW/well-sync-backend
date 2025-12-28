import { ApiPropertyOptional } from '@nestjs/swagger';

class UpdateUserPreferencesDto {
  @ApiPropertyOptional({ example: 'push', enum: ['email', 'sms', 'push'] })
  notificationChannel?: 'email' | 'sms' | 'push';

  @ApiPropertyOptional({ example: ['Increase mindfulness'] })
  highLevelGoals?: string[];
}

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ example: 'Updated User' })
  name?: string;

  @ApiPropertyOptional({ example: 'alex.updated@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: 'UTC' })
  timezone?: string;

  @ApiPropertyOptional({ example: ['sleep'] })
  focusAreas?: string[];

  @ApiPropertyOptional({ type: UpdateUserPreferencesDto })
  preferences?: UpdateUserPreferencesDto;
}
