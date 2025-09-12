/*
 * @description: auth request interface extends from express request
 * @author: Nhut Tan
 * @date: 2025-09-09
 * @version: 1.0.0
 * */

import { Request as ExpressRequest } from 'express';
import { JwtPayloadInterface } from './jwt.payload.interface';

export interface AuthRequest extends ExpressRequest {
  user: JwtPayloadInterface;
}
