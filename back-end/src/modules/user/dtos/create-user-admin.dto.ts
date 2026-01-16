import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';
import {Type} from "class-transformer";

export class CreateUserAdminDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    fullName: string;

    @IsString()
    roleName: string;

    @IsOptional()
    status?: UserStatus;
}
