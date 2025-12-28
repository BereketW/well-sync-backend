export interface UpdateUserPreferencesDto {
  notificationChannel?: 'email' | 'sms' | 'push';
  highLevelGoals?: string[];
}

export interface UpdateUserProfileDto {
  name?: string;
  email?: string;
  timezone?: string;
  focusAreas?: string[];
  preferences?: UpdateUserPreferencesDto;
}
