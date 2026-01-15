/**
 * @description User detail entity
 * @author Nhut Tan
 * @since 2025-09-05
 * @modifies 2025-09-14
 * @version 1.0.2
 */

import { TimestampField } from '../../../common/database/timestamp.field';
import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({name: 'user_details'})
export class UserDetailEntity extends TimestampField {
	@PrimaryColumn()
	id: number;

	@Column({
		name: 'address_1',
		type: 'text',
		nullable: true,
	})
	address1: string | undefined;

	@Column({
		name: 'address_2',
		type: 'text',
		nullable: true,
	})
	address2: string | undefined;

	@Column({
		name: 'address_3',
		type: 'text',
		nullable: true,
	})
	address3: string | undefined;

	@Column({ name: 'phone_number', type: 'varchar', nullable: true })
	phoneNumber: string | undefined;

	@OneToOne(
		(): typeof UserEntity => UserEntity,
		(user: UserEntity): UserDetailEntity => user.userDetail,
		{
			cascade: ['insert', 'update', 'soft-remove'],
		}
	)
	@JoinColumn({ name: 'id' })
	user: UserEntity;
}
