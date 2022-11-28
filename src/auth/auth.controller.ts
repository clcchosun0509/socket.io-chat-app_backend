import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  googleRedirect(@Res() res: Response) {
    res.send(200);
  }
}
