import { ApiProperty } from '@nestjs/swagger';

class UserPreferencesDto {
  @ApiProperty({ example: 'email', enum: ['email', 'sms', 'push'] })
  notificationChannel!: 'email' | 'sms' | 'push';

  @ApiProperty({ example: ['Improve sleep quality', 'Increase mindfulness'] })
  highLevelGoals!: string[];
}

export class UserProfileDto {
  @ApiProperty({ example: 'u-1000' })
  id!: string;

  @ApiProperty({ example: 'Alex Doe' })
  name!: string;

  @ApiProperty({ example: 'alex.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'UTC+03:00' })
  timezone!: string;

  @ApiProperty({ example: ['stress-management', 'nutrition'] })
  focusAreas!: string[];

  @ApiProperty({ type: UserPreferencesDto })
  preferences!: UserPreferencesDto;
}
