/*
 * @description: Migration creating `cart_details` table
 * @author: Nhut Tan
 * @date: 2025/09/06
 * @version: 1.0.0
 * */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { OrderStatusEnum } from '../modules/orders/enums/order.status.enum';

export class CreateOrdersTable1757153969179 implements MigrationInterface {
  /*
   * @description: Migration run creating `cart_details` table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `orders` table if exist
     * */
    const ordersTable: Table | undefined = await queryRunner.getTable('orders');

    /*
     * Check if `orders` table exists
     * */
    if (!ordersTable) {
      /*
       * Create new `orders` table if not exists
       * */
      await queryRunner.createTable(
        new Table({
          name: 'orders',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
              isNullable: false,
            },
            {
              name: 'user_id',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'price',
              type: 'double precision',
              isNullable: false,
            },
            {
              name: 'status',
              type: 'enum',
              enum: Object.values(OrderStatusEnum),
              default: `'${OrderStatusEnum.ACTIVE}'`,
              isNullable: false,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              isNullable: false,
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              isNullable: false,
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );
    }

    /*
     * Get `orders` table after created
     * */
    const ordersTableCreated: Table | undefined =
      await queryRunner.getTable('orders');

    /*
     * Check if `orders` table created
     * */
    if (ordersTableCreated) {
      /*
       * Get foreign keys in `orders` table named `fk_orders_user_id_to_users_id`
       * */
      const ordersFks: TableForeignKey | undefined =
        ordersTableCreated.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_orders_user_id_to_users_id',
        );

      /*
       * Check if `fk_orders_user_id_to_users_id` fk not exist
       * */
      if (!ordersFks) {
        /*
         * Create new fk `fk_orders_user_id_to_users_id`
         */
        await queryRunner.createForeignKey(
          ordersTableCreated,
          new TableForeignKey({
            name: 'fk_orders_user_id_to_users_id',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
          }),
        );
      }

      /*
       * Get all index in `orders` table
       * */
      const ordersIndex: TableIndex[] = ordersTableCreated.indices || [];

      /*
       * Get `idx_orders_id` index if exist
       */
      const ordersIndexId: TableIndex | undefined = ordersIndex.find(
        (index: TableIndex): boolean => index.name === 'idx_orders_id',
      );

      /*
       * Check if `idx_orders_id` index not exist
       * */
      if (!ordersIndexId) {
        /*
         * Create `idx_orders_id` index if not exist
         * */
        await queryRunner.createIndex(
          ordersTableCreated,
          new TableIndex({
            name: 'idx_orders_id',
            columnNames: ['id'],
          }),
        );
      }

      /*
       * Get `idx_orders_user_id` index if exist
       */
      const ordersIndexUserId: TableIndex | undefined = ordersIndex.find(
        (index: TableIndex): boolean => index.name === 'idx_orders_user_id',
      );

      /*
       * Check if `idx_orders_user_id` index not exist
       * */
      if (!ordersIndexUserId) {
        /*
         * Create new `idx_orders_user_id` index
         * */
        await queryRunner.createIndex(
          ordersTableCreated,
          new TableIndex({
            name: 'idx_orders_user_id',
            columnNames: ['user_id'],
          }),
        );
      }
    }
  }

  /*
   * @description: Migration revert creating `cart_details` table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `orders` table after created
     * */
    const ordersTableCreated: Table | undefined =
      await queryRunner.getTable('orders');

    /*
     * Check if `orders` table created
     * */
    if (ordersTableCreated) {
      /*
       * Get foreign keys in `orders` table named `fk_orders_user_id_to_users_id`
       * */
      const ordersFks: TableForeignKey | undefined =
        ordersTableCreated.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_orders_user_id_to_users_id',
        );

      /*
       * Check if `fk_orders_user_id_to_users_id` fk exist
       * */
      if (ordersFks) {
        /*
         * Drop fk `fk_orders_user_id_to_users_id` if exist
         */
        await queryRunner.dropForeignKey(
          ordersTableCreated,
          'fk_orders_user_id_to_users_id',
        );
      }

      /*
       * Get all index in `orders` table
       * */
      const ordersIndex: TableIndex[] = ordersTableCreated.indices || [];

      /*
       * Get `idx_orders_id` index if exist
       */
      const ordersIndexId: TableIndex | undefined = ordersIndex.find(
        (index: TableIndex): boolean => index.name === 'idx_orders_id',
      );

      /*
       * Check if `idx_orders_id` index exist
       * */
      if (ordersIndexId) {
        /*
         * Drop `idx_orders_id` index if exist
         * */
        await queryRunner.dropIndex(ordersTableCreated, 'idx_orders_id');
      }

      /*
       * Get `idx_orders_user_id` index if exist
       */
      const ordersIndexUserId: TableIndex | undefined = ordersIndex.find(
        (index: TableIndex): boolean => index.name === 'idx_orders_user_id',
      );

      /*
       * Check if `idx_orders_user_id` index exist
       * */
      if (!ordersIndexUserId) {
        /*
         * Drop `idx_orders_user_id` index if exist
         * */
        await queryRunner.dropIndex(ordersTableCreated, 'idx_orders_user_id');
      }
    }
  }
}
