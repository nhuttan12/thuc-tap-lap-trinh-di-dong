import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { UserAuthenticationEntity } from '../entities/user-authentication.entity';

@Injectable()
export class UserAuthenticationRepository {
	private readonly logger = new Logger(UserAuthenticationRepository.name);

	constructor(
		@InjectRepository(UserAuthenticationEntity)
		private readonly repo: Repository<UserAuthenticationEntity>
	) {}

	/**
	 * @description
	 * Lấy bản ghi authentication theo userId
	 *
	 * @usecase
	 * - Khi gửi OTP lần đầu
	 * - Khi cập nhật OTP cho user đã tồn tại
	 *
	 * @param userId id của user
	 * @returns UserAuthenticationEntity | null
	 */
	async findByUserId(
		userId: number
	): Promise<UserAuthenticationEntity | null> {
		try {
			return await this.repo.findOne({
				where: { userId },
			});
		} catch (e) {
			this.logger.error(
				`Error in findByUserId: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description
	 * Lấy OTP mới nhất đang tồn tại trong hệ thống
	 *
	 * @usecase
	 * - Khi người dùng nhập OTP để xác thực
	 * - Dùng để so sánh OTP user nhập với OTP đã gửi
	 *
	 * @note
	 * - Chỉ lấy bản ghi có resetOtp IS NOT NULL
	 * - Sắp xếp theo updatedAt DESC để lấy OTP mới nhất
	 *
	 * @returns UserAuthenticationEntity | null
	 */
	async findLatestOtp(): Promise<UserAuthenticationEntity | null> {
		try {
			return await this.repo.findOne({
				where: {
					resetOtp: Not(IsNull()),
				},
				order: {
					updatedAt: 'DESC',
				},
			});
		} catch (e) {
			this.logger.error(
				`Error in findLatestOtp: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description
	 * Tìm bản ghi authentication theo reset token
	 *
	 * @usecase
	 * - Sau khi OTP được xác thực thành công
	 * - Client gửi resetToken để đổi mật khẩu mới
	 *
	 * @param resetToken token dùng để reset mật khẩu
	 * @returns UserAuthenticationEntity | null
	 */
	async findByResetToken(
		resetToken: string
	): Promise<UserAuthenticationEntity | null> {
		try {
			return await this.repo.findOne({
				where: { resetToken },
			});
		} catch (e) {
			this.logger.error(
				`Error in findByResetToken: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description
	 * Lưu hoặc cập nhật bản ghi authentication
	 *
	 * @usecase
	 * - Lưu OTP mới
	 * - Cập nhật thời gian hết hạn OTP
	 * - Lưu resetToken
	 * - Xoá OTP / resetToken sau khi đổi mật khẩu thành công
	 *
	 * @param entity UserAuthenticationEntity
	 * @returns UserAuthenticationEntity
	 */
	async save(
		entity: UserAuthenticationEntity
	): Promise<UserAuthenticationEntity> {
		try {
			return await this.repo.save(entity);
		} catch (e) {
			this.logger.error(
				`Error in save: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description
	 * Khởi tạo mới UserAuthenticationEntity cho user
	 *
	 * @usecase
	 * - User chưa có bản ghi trong bảng user_authentications
	 * - Dùng trước khi gọi save()
	 *
	 * @param userId id của user
	 * @returns UserAuthenticationEntity
	 */
	create(userId: number): UserAuthenticationEntity {
		return this.repo.create({ userId });
	}
}
