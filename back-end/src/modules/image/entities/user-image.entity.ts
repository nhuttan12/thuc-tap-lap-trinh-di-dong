/*
 * @description: User image entity
 * @author: Nhut Tan
 * @date: 2025-09-07
 * @modified: 2025-09-14
 * @version: 1.0.3
 * */

import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { UserEntity } from '../../user/entities/user.entity';
import { ImageEntity } from './image.entity';

@Entity('user_images')
export class UserImageEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (): typeof UserEntity => UserEntity,
    (userEntity: UserEntity): UserImageEntity[] => userEntity.userImages,
  )
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToOne(
    (): typeof ImageEntity => ImageEntity,
    (imageEntity: ImageEntity): UserImageEntity => imageEntity.userImage,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  image: ImageEntity;
}
