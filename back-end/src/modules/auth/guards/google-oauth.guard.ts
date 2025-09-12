/*
 * @description: google auth guard used for login with google account
 * @author: Nhut Tan
 * @date: 2025-09-10
 * @version: 1.0.0
 * */

import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../../common/config/config.service';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  constructor(private readonly configService: ConfigService) {
    super({
      accessType: configService.googleConfig.accessType,
    });
  }
}
