/*
 * @description: google oauth 2 strategy passport
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @modified: 2025-09-12
 * @version: 1.0.2
 * */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '../../../common/config/config.service';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { AuthService } from '../auth.service';
import { GoogleLogin } from '../interface/google-login.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.googleConfig.clientID,
      clientSecret: configService.googleConfig.clientSecret,
      callbackURL: configService.googleConfig.callbackURL,
      scope: ['profile', 'email'],
    });
  }

  /*
   * @description: validate function is call when google passport is called
   * @param: Profile
   * @param: VerifyCallback
   * @return: void
   * @author: Nhut Tan
   * @date: 2025-09-10
   * @modified: 2025-09-12
   * @version: 1.0.1
   * */
  validate(profile: Profile, done: VerifyCallback): void {
    /*
     * Get user profile from Google o-auth 2
     * */
    const { id, name, emails, photos } = profile;

    /*
     * Get value from name, emails, photos field
     * */
    const email: string = emails?.[0]?.value || '';
    const fullName: string = [
      name?.givenName,
      name?.middleName,
      name?.familyName,
    ]
      .filter(Boolean)
      .join(' ');
    const photo: string = photos?.[0]?.value || '';

    const response: GoogleLogin = {
      provider: 'google',
      providerId: id,
      email: email,
      name: fullName,
      picture: photo,
    };

    done(null, response);
  }
}
