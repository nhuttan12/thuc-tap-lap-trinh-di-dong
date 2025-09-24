/**
 * @description Seed initial data into database
 * @author Nhut Tan
 * @since 2025-09-22
 * @version 1.0.0
 */

import { DataSource, EntityManager } from 'typeorm';
import { env } from 'node:process';
import { config } from 'dotenv';
import { RoleEntity } from '../../../modules/role/entities/role.entity';
import { Logger } from '@nestjs/common';
import { RoleName } from '../../../modules/role/enums/role-name.enum';
import { RoleStatus } from '../../../modules/role/enums/role-status.enum';
import { ImageEntity } from '../../../modules/image/entities/image.entity';
import { ImageStatusEnum } from '../../../modules/image/enums/image-status.enum';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { ProductImageEntity } from '../../../modules/image/entities/product-image.entity';
import { UserImageEntity } from '../../../modules/image/entities/user-image.entity';
import { ProductEntity } from '../../../modules/product/entities/product.entity';
import { OrderEntity } from '../../../modules/orders/entities/order.entity';
import { OrderDetailEntity } from '../../../modules/orders/entities/order-detail.entity';
import { ProductDetailsEntity } from '../../../modules/product/entities/product-details.entity';
import { CategoryEntity } from '../../../modules/category/entities/category.entity';
import { CartEntity } from '../../../modules/cart/entities/cart.entity';
import { CartDetailEntity } from '../../../modules/cart/entities/cart-detail.entity';
import { UserDetailEntity } from '../../../modules/user/entities/user-detail.entity';

/**
 * Load environment file before readding env
 */
config({ path: '.env.local' });

/**
 * Initial logger
 */
const logger: Logger = new Logger('Seed');

const AppDataSource = new DataSource({
  type: env.DATABASE_TYPE as 'postgres',
  host: env.DATABASE_HOST,
  port: Number(env.DATABASE_PORT),
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  logging: true,
  synchronize: false,
  entities: [
    ImageEntity,
    RoleEntity,
    UserEntity,
    ProductImageEntity,
    UserImageEntity,
    ProductEntity,
    OrderDetailEntity,
    OrderEntity,
    ProductDetailsEntity,
    CategoryEntity,
    CartEntity,
    CartDetailEntity,
    UserDetailEntity,
  ],
});

export async function seed(): Promise<void> {
  try {
    /**
     * Initialize database connection
     */
    await AppDataSource.initialize();
    logger.log('Connected to database...');

    /**
     * Start transaction
     */
    await AppDataSource.transaction(async (tx: EntityManager) => {
      /**
       * Insert role data
       */
      for (const role of [
        { name: RoleName.ADMIN, status: RoleStatus.ACTIVE },
        { name: RoleName.CUSTOMER, status: RoleStatus.ACTIVE },
        { name: RoleName.EMPLOYEE, status: RoleStatus.ACTIVE },
      ]) {
        /**
         * Check exist each role by name
         */
        const exists: RoleEntity | null = await tx
          .getRepository(RoleEntity)
          .findOne({ where: { name: role.name } });

        /**
         * If not exist, create new role
         */
        if (!exists) {
          await tx.getRepository(RoleEntity).save({
            ...role,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          logger.log(`Inserted role: ${role.name}`);
        } else {
          logger.log(`Role already exists: ${role.name}`);
        }
      }

      /**
       * Insert default user image if not exist
       */
      const defaultImageUrl =
        'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1758105162/user-circle-isolated-icon-round-600nw-2459622791_zviocb.webp';

      /**
       * Get image by default image url
       */
      const imageExists: ImageEntity | null = await tx
        .getRepository(ImageEntity)
        .findOne({ where: { url: defaultImageUrl } });

      /**
       * If not exist, create new image
       */
      if (!imageExists) {
        await tx.getRepository(ImageEntity).save({
          url: defaultImageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: ImageStatusEnum.ACTIVE,
        });
        logger.log('Inserted default user image');
      } else {
        logger.log('Default user image already exists');
      }
    });

    logger.log('Seed success...');
  } catch (e) {
    console.error('❌ Seeding failed:', e);
  } finally {
    /**
     * Close database connection
     */
    logger.log('Close database connection...');
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}
