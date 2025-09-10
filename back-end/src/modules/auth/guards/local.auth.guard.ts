/*
 * @description: local auth guard used for login with username and password
 * @author: Nhut Tan
 * @date: 2025-09-09
 * @version: 1.0.0
 * */

import { AuthGuard } from '@nestjs/passport';

export class LocalAuthGuard extends AuthGuard('local') {}
