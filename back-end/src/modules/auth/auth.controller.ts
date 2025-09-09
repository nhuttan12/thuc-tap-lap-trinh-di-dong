/*
 * @description: auth controller for login user
 * @author: Nhut Tan
 * @date: 2025-09-09
 * @version: 1.0.0
 * */

import { Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { JwtPayloadInterface } from './interface/jwt.payload.interface';
import { AuthRequest } from './interface/auth.request';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /*
   * @description: login user via local strategy passport
   * @param: req: AuthRequest
   * @return: JwtPayloadInterface
   * @author: Nhut Tan
   * @date: 2025-09-09
   * @version: 1.0.0
   * */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: AuthRequest): JwtPayloadInterface {
    return req.user;
  }
}
