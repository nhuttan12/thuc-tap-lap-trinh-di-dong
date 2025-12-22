import { IsString, MinLength } from 'class-validator';

export class ResetPasswordRequestDto {
	@IsString()
	resetToken: string;

	@IsString()
	@MinLength(6)
	newPassword: string;
}