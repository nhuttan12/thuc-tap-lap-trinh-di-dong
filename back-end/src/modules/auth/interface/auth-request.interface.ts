/*
 * @description: auth request interface extends from express request
 * @author: Nhut Tan
 * @date: 2025-09-09
 * @version: 1.0.0
 * */

import { Request as ExpressRequest } from 'express';
import { JwtPayload } from './jwt-payload.interface';

export interface AuthRequest extends ExpressRequest {
  user: JwtPayload;
}
