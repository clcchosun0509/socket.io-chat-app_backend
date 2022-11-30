import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    const GOOGLE_CLIENT_ID = configService.get<string>('GOOGLE_CLIENT_ID');
    const GOOGLE_CLIENT_SECRET = configService.get<string>(
      'GOOGLE_CLIENT_SECRET',
    );
    const EXPRESS_PORT = configService.get<string>('EXPRESS_PORT');
    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${EXPRESS_PORT}/auth/google-redirect`,
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { provider, id, emails, displayName, photos } = profile;
    const user = {
      id: `${provider}_${id}`,
      email: emails[0].value,
      username: displayName,
      avatar: photos[0].value,
      room: null
    };
    return this.authService.validate(user);
  }
}
