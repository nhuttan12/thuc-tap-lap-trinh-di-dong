/*
 * @description: local strategy passport
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @version: 1.0.0
 * */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserLoginRequestDto } from '../dtos/user.login.request.dto';
import { JwtPayloadInterface } from '../interface/jwt.payload.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger = new Logger(LocalStrategy.name);
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate({
    username,
    password,
  }: UserLoginRequestDto): Promise<JwtPayloadInterface> {
    /*
     * Get user by username and password
     * */
    const user: JwtPayloadInterface = await this.authService.validateUser(
      username,
      password,
    );
    this.logger.debug(`User after validate: ${JSON.stringify(user)}`);

    /*
     * Return user
     * */
    return user;
  }
}
