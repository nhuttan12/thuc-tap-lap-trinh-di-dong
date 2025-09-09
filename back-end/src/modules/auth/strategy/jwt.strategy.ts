/*
 * @description: jwt strategy passport
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @version: 1.0.0
 * */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../common/config/config.service';
import { JwtPayloadInterface } from '../interface/jwt.payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.httpConfig.jwtSecret,
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<JwtPayloadInterface> {
    return {
      id: payload.id,
      accessToken: payload.accessToken,
      role: payload.role,
      email: payload.email,
    };
  }
}
