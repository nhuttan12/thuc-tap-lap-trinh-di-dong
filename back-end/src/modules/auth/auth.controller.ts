/**
 * @description auth controller for login user
 * @author Nhut Tan
 * @since 2025-09-09
 * @version 1.0.0
 */

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Req,
  Request,
  Res,
  UseFilters,
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
import { UserSignUpRequestDto } from './dtos/user-sign-up-request.dto';
import { UserEntityResponseDto } from '../user/dtos/user-entity-response.dto';
import { CatchEverythingFilter } from '../../common/filter/catch-everything.filter';

@Controller('auth')
@UseFilters(CatchEverythingFilter)
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * @description login user via local strategy passport
   * @param: req: AuthRequest
   * @return: JwtPayload
   * @author Nhut Tan
   * @since 2025-09-09
   * @version 1.0.0
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: AuthRequest): JwtPayload {
    return req.user;
  }

  /**
   * @description login user via Google strategy passport
   * @author Nhut Tan
   * @since 2025-09-09
   * @version 1.0.0
   */
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth(): Promise<void> {}

  /**
   * @description callback from Google strategy passport
   * @param req
   * @param res
   * @author Nhut Tan
   * @since 2025-09-09
   * @version 1.0.0
   */
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

  /**
   * @description Sign up user
   * @param: request: UserSignUpRequestDto
   * @return: UserEntityResponseDto
   * @author Nhut Tan
   * @since 2025-09-17
   * @version 1.0.0
   */
  @Post('sign-up')
  async signUp(
    @Body() request: UserSignUpRequestDto,
  ): Promise<UserEntityResponseDto> {
    return await this.authService.signUp(
      request.username,
      request.email,
      request.password,
      request.retypePassword,
    );
  }
}
