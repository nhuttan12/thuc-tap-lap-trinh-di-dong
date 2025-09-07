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

export class CreateOrderDetailsTable1757153984470
  implements MigrationInterface
{
  /*
   * @description: Migration run creating `cart_details` table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `order_details` table
     * */
    const orderDetailsTable: Table | undefined =
      await queryRunner.getTable('order_details');

    /*
     * Check if `order_details` table not exist
     * */
    if (!orderDetailsTable) {
      /*
       * Create `order_tails` table
       * */
      await queryRunner.createTable(
        new Table({
          name: 'order_details',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
              isNullable: false,
            },
            {
              name: 'order_id',
              type: 'integer',
              isNullable: false,
            },
            {
              name: 'product_id',
              type: 'integer',
              isNullable: false,
            },
            {
              name: 'quantity',
              type: 'integer',
              isNullable: false,
            },
            {
              name: 'price',
              type: 'double precision',
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
     * Get `order_details` table after created
     * */
    const orderDetailsTableCreated: Table | undefined =
      await queryRunner.getTable('order_details');

    /*
     * Check if `order_details` created
     * */
    if (orderDetailsTableCreated) {
      /*
       * Get all order_details foreign keys
       * */
      const orderDetailsFks: TableForeignKey[] =
        orderDetailsTableCreated.foreignKeys;

      /*
       * Check if foreign key `fk_order_details_order_id_orders_id` not exist
       * */
      if (
        !orderDetailsFks.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_order_details_order_id_orders_id',
        )
      ) {
        /*
         * Create new foreign key named `fk_order_details_order_id_orders_id`
         * */
        await queryRunner.createForeignKey(
          orderDetailsTableCreated,
          new TableForeignKey({
            name: 'fk_order_details_order_id_orders_id',
            columnNames: ['order_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'orders',
          }),
        );
      }

      /*
       * Check if foreign key `fk_order_details_product_id_products_id` not exist
       * */
      if (
        !orderDetailsFks.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_order_details_product_id_products_id',
        )
      ) {
        /*
         * Create new foreign key named `fk_order_details_product_id_products_id`
         * */
        await queryRunner.createForeignKey(
          orderDetailsTableCreated,
          new TableForeignKey({
            name: 'fk_order_details_product_id_products_id',
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'products',
          }),
        );
      }

      /*
       * Get index in `order_details` table named `inx_orders_id`
       * */
      const orderDetailsIndexId: TableIndex | undefined =
        orderDetailsTableCreated.indices.find(
          (i: TableIndex): boolean => i.name === 'inx_orders_id',
        );

      /*
       * Create new index named `inx_orders_id` if not exist
       * */
      if (!orderDetailsIndexId) {
        await queryRunner.createIndex(
          orderDetailsTableCreated,
          new TableIndex({
            name: 'inx_orders_id',
            columnNames: ['id'],
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
     * Get `order_details` table after created
     * */
    const orderDetailsTableCreated: Table | undefined =
      await queryRunner.getTable('order_details');

    /*
     * Check if `order_details` created
     * */
    if (orderDetailsTableCreated) {
      /*
       * Get all order_details foreign keys
       * */
      const orderDetailsFks: TableForeignKey[] =
        orderDetailsTableCreated.foreignKeys;

      /*
       * Check if foreign key `fk_order_details_order_id_orders_id` exist
       * */
      if (
        orderDetailsFks.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_order_details_order_id_orders_id',
        )
      ) {
        /*
         * Drop foreign key named `fk_order_details_order_id_orders_id` if exist
         * */
        await queryRunner.dropForeignKey(
          orderDetailsTableCreated,
          'fk_order_details_order_id_orders_id',
        );
      }

      /*
       * Check if foreign key `fk_order_details_product_id_products_id` exist
       * */
      if (
        orderDetailsFks.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_order_details_product_id_products_id',
        )
      ) {
        /*
         * Drop foreign key named `fk_order_details_product_id_products_id` if exist
         * */
        await queryRunner.dropForeignKey(
          orderDetailsTableCreated,
          'fk_order_details_product_id_products_id',
        );
      }

      /*
       * Get index in `order_details` table named `inx_orders_id`
       * */
      const orderDetailsIndexId: TableIndex | undefined =
        orderDetailsTableCreated.indices.find(
          (i: TableIndex): boolean => i.name === 'inx_orders_id',
        );

      /*
       * Drop index named `inx_orders_id` if exist
       * */
      if (orderDetailsIndexId) {
        await queryRunner.dropIndex(orderDetailsTableCreated, 'inx_orders_id');
      }
    }
  }
}
