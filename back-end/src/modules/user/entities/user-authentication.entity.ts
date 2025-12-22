/**
 * @description user authentication entity
 * @author Vo Tan Tai
 * @since 2025-12-19
 * @version 1.0.0
 */

import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";
import {TimestampField} from "../../../common/database/timestamp.field";

@Entity('user_authentications')
export class UserAuthenticationEntity extends TimestampField{
    @PrimaryColumn({ name: 'user_id', type: 'int' })
    userId: number;

    @OneToOne((): typeof UserEntity => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    /**
     * Token dùng để reset mật khẩu sau khi OTP được xác thực thành công
     * - Được tạo ngẫu nhiên (randomBytes)
     * - Gửi về client (FE / Mobile)
     * - Chỉ dùng 1 lần
     */
    @Column({ name: 'reset_token', type: 'text', nullable: true })
    resetToken: string | null;

    /**
     * Thời điểm hết hạn của reset token (timestamp milliseconds)
     * - Thường 5–10 phút
     * - Sau khi reset mật khẩu thành công sẽ bị xoá
     */
    @Column({ name: 'reset_token_expiration', type: 'bigint', nullable: true })
    resetTokenExpiration: number | null;

    /**
     * OTP hash (bcrypt) dùng để xác thực người dùng khi quên mật khẩu
     * - OTP gốc có 6 chữ số
     * - Lưu dưới dạng hash để đảm bảo bảo mật
     * - Không bao giờ lưu OTP plain text
     */
    @Column({ name: 'reset_otp', type: 'text', nullable: true })
    resetOtp: string | null;

    /**
     * Thời điểm hết hạn của OTP (timestamp milliseconds)
     * - Thường 1–3 phút
     * - Sau khi verify OTP thành công sẽ bị xoá
     */
    @Column({ name: 'reset_otp_expiration', type: 'bigint', nullable: true })
    resetOtpExpiration: number | null;
}