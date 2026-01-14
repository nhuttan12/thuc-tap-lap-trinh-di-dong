import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';

export class UpdateUserAdminDto {
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

    @IsOptional()
    @IsNumber()
    roleId?: number;
}
