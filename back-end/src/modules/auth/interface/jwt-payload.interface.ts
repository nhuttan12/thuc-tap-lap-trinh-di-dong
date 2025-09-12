/*
 * @description: jwt payload interface
 * @author: Nhut Tan
 * @date: 2025-09-10
 * @version: 1.0.0
 * */

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
  accessToken: string;
}
