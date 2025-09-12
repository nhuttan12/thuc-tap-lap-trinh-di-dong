/*
 * @description: google request interface extends from express request
 * and using Google login interface
 * @author: Nhut Tan
 * @date: 2025-09-12
 * @version: 1.0.0
 * */

import { Request as ExpressRequest } from 'express';
import { GoogleLogin } from './google-login.interface';

export interface GoogleRequest extends ExpressRequest {
  user: GoogleLogin;
}
