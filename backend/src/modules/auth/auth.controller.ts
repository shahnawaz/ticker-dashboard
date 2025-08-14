import { Body, Controller, Post } from '@nestjs/common';

@Controller('api')
export class AuthController {
  @Post('login')
  login(@Body() body: any) {
    const { username, password } = body || {};
    if (!username || !password) {
      return { error: 'Missing credentials' };
    }
    return { token: 'fake-token-' + Buffer.from(username).toString('base64') };
  }
}
