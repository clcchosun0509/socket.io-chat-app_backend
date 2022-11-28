import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Profile } from 'passport-google-oauth20';
import { User } from '../../entities';
import { AuthService } from '../auth.service';
import { GoogleStrategy } from './google.strategy';

describe('GoogleStrategy', () => {
  let googleStrategy: GoogleStrategy;
  let fakeConfigService: Partial<ConfigService>;
  let fakeAuthService: Partial<AuthService>;
  let profile: Profile;

  beforeEach(async () => {
    profile = {
      provider: 'google',
      id: '1',
      emails: [{ value: 'test@test.com', verified: 'true' }],
      displayName: 'testname',
      photos: [{ value: 'http://test.com/photo.jpg' }],
      profileUrl: '',
      _raw: '',
      _json: { iss: '', aud: '', sub: '', iat: 0, exp: 0 },
    };
    fakeConfigService = {
      get(value: string) {
        return value;
      },
    };
    fakeAuthService = {
      validate: (user: User) => {
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        { provide: ConfigService, useValue: fakeConfigService },
        { provide: 'AUTH_SERVICE', useValue: fakeAuthService },
      ],
    }).compile();

    googleStrategy = module.get<GoogleStrategy>(GoogleStrategy);
  });

  it('should be defined', () => {
    expect(googleStrategy).toBeDefined();
  });

  it('validate returns user entity', async () => {
    const user = await googleStrategy.validate('', '', profile);
    
    expect(user.id).toBe(`${profile.provider}_${profile.id}`);
    expect(user.email).toBe(profile.emails[0].value);
    expect(user.username).toBe(profile.displayName);
    expect(user.avatar).toBe(profile.photos[0].value);
  });
});
