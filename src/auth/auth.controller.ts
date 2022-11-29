import {
  Controller,
  Get,
  Req,
  Res,
  Next,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}
  private readonly CLIENT_URL = this.configService.get<string>('CLIENT_URL');

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleLogin() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleRedirect(@Res() res: Response) {
    res.redirect(this.CLIENT_URL);
  }

  @Get('status')
  @UseGuards(AuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  logout(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect(this.CLIENT_URL);
    });
  }
}
