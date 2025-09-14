/*
 * @description: auth module
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @last modified: 2025-09-14
 * @version: 1.0.2
 * */

import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../common/config/config.module';
import { ConfigService } from '../../common/config/config.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { AuthController } from './auth.controller';
import { AuthMapper } from './mapper/auth.mapper';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.httpConfig.jwtSecret,
        signOptions: {
          expiresIn: configService.httpConfig.expireTime,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    AuthMapper,
  ],
  exports: [AuthService],
})
export class AuthModule {}
