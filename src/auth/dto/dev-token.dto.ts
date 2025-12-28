import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DevTokenRequestDto {
  @ApiProperty({ example: 'u-1000' })
  sub!: string;

  @ApiProperty({ example: 'alex.doe@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: 'user' })
  role?: string;

  @ApiPropertyOptional({ example: 3600 })
  expiresInSeconds?: number;
}

export class DevTokenResponseDto {
  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ example: 3600 })
  expiresInSeconds!: number;
}
