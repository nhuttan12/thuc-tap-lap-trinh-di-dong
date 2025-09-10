/*
 * @description: google oauth 2 strategy passport
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @modified: 2025-09-10
 * @version: 1.0.1
 * */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '../../../common/config/config.service';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { JwtPayloadInterface } from '../interface/jwt.payload.interface';
import { AuthService } from '../auth.service';

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

  async validate(
    accessToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<JwtPayloadInterface> {
    /*
     * Get user profile from google o-auth 2
     * */
    const { name, emails, photos } = profile;

    const user: JwtPayloadInterface = await this.authService.validateUserGoole(
      accessToken,
      name,
      emails,
      photos,
    );

    done(null, user);
  }
}
