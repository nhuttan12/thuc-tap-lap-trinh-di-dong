/*
 * @description: auth controller for login user
 * @author: Nhut Tan
 * @date: 2025-09-09
 * @version: 1.0.0
 * */

import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtPayload } from './interface/jwt-payload.interface';
import { AuthRequest } from './interface/auth-request.interface';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { GoogleRequest } from './interface/google-request';
import { GoogleLogin } from './interface/google-login.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /*
   * @description: login user via local strategy passport
   * @param: req: AuthRequestInterface
   * @return: JwtPayloadInterface
   * @author: Nhut Tan
   * @date: 2025-09-09
   * @version: 1.0.0
   * */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: AuthRequest): JwtPayload {
    return req.user;
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: GoogleRequest, @Res() res: Response) {
    const user: GoogleLogin = req.user;
    const token: JwtPayload = await this.authService.googleLogin(
      user.email,
      user.name,
      user.picture,
    );

    res.cookie('access_token', token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    return res.status(HttpStatus.OK);
  }
}
