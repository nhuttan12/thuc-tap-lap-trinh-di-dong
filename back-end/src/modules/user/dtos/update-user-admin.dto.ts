// update-user-admin.dto.ts
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';

export class UpdateUserAdminDto {
    @IsOptional()
    @IsString()
    fullName?: string;  // DÙNG fullName ĐỂ UPDATE NAME

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

    @IsOptional()
    @IsNumber()
    roleId?: number;
}