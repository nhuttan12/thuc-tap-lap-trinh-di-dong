import { UserResponseDto } from '../../user/dtos/user.response.dto';
import { JwtPayloadInterface } from '../interface/jwt.payload.interface';

export class AuthMapper {
  static toJwtPayload(user: UserResponseDto): JwtPayloadInterface {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      accessToken: '',
    };
  }
}
