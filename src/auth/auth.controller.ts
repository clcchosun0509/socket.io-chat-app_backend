import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  @Get('google-login')
  @UseGuards(GoogleOAuthGuard)
  googleLogin() {
    return;
  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleRedirect(@Res() res: Response) {
    res.send(200);
  }
}
