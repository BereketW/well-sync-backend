import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from './public.decorator';
import { signJwtHs256 } from './jwt.utils';
import { DevTokenRequestDto, DevTokenResponseDto } from './dto/dev-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Public()
  @Post('dev-token')
  @ApiBody({ type: DevTokenRequestDto })
  @ApiCreatedResponse({ type: DevTokenResponseDto })
  devToken(@Body() body: DevTokenRequestDto): DevTokenResponseDto {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Dev token endpoint is disabled in production');
    }

    const secret = process.env.AUTH_JWT_SECRET;
    if (!secret) {
      throw new Error('AUTH_JWT_SECRET is not configured');
    }

    const expiresInSeconds = body.expiresInSeconds ?? 3600;
    const now = Math.floor(Date.now() / 1000);

    const accessToken = signJwtHs256(
      {
        sub: body.sub,
        email: body.email,
        role: body.role,
        iat: now,
        exp: now + expiresInSeconds,
      },
      secret,
    );

    return {
      tokenType: 'Bearer',
      accessToken,
      expiresInSeconds,
    };
  }

  @Public()
  @Post('logout')
  @ApiOkResponse({
    schema: {
      example: {
        ok: true,
        message: 'Logged out. Clear the Bearer token client-side.',
      },
    },
  })
  logout(): { ok: true; message: string } {
    return {
      ok: true,
      message: 'Logged out. Clear the Bearer token client-side.',
    };
  }
}
