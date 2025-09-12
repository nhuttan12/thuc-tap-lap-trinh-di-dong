/*
 * @description: Migration to create `cart_details` table
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
import { CartDetailsStatusEnum } from '../modules/cart/enums/cart-details.status.enum';

export class CreateCartDetailsTable1757151659118 implements MigrationInterface {
  /*
   * @description: Migration run creating `cart_details` table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `cart_details` table if exist
     * */
    const cartDetailsTable: Table | undefined =
      await queryRunner.getTable('cart_details');

    /*
     * If `cart_details` table exists
     * */
    if (!cartDetailsTable) {
      await queryRunner.createTable(
        new Table({
          name: 'cart_details',
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
              name: 'cart_id',
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
              name: 'status',
              type: 'enum',
              enum: Object.values(CartDetailsStatusEnum),
              default: `'${CartDetailsStatusEnum.ACTIVE}'`,
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
     * Get `cart_details` table after created
     * */
    const cartDetailsTableCreated: Table | undefined =
      await queryRunner.getTable('cart_details');

    /*
     * If `cart_details` table exist
     * */
    if (cartDetailsTableCreated) {
      /*
       * Get all foreign key constraints in `cart_details` table
       * */
      const cartDetailsFks: TableForeignKey[] =
        cartDetailsTableCreated.foreignKeys || [];

      /*
       * Check if fk `fk_cart_details_cart_id_to_carts_id` not exist
       * */
      if (
        !cartDetailsFks.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_cart_details_cart_id_to_carts_id',
        )
      ) {
        /*
         * Create fk `fk_cart_details_cart_id_to_carts_id`
         * */
        await queryRunner.createForeignKey(
          cartDetailsTableCreated,
          new TableForeignKey({
            name: 'fk_cart_details_cart_id_to_carts_id',
            columnNames: ['cart_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'carts',
          }),
        );
      }

      /*
       * Check if fk `fk_cart_details_product_id_to_products_id` not exist
       * */
      if (
        !cartDetailsFks.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_cart_details_product_id_to_products_id',
        )
      ) {
        /*
         * Create fk `fk_cart_details_product_id_to_products_id`
         * */
        await queryRunner.createForeignKey(
          cartDetailsTableCreated,
          new TableForeignKey({
            name: 'fk_cart_details_product_id_to_products_id',
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'products',
          }),
        );
      }

      /*
       * Get all index in `cart_details` table
       * */
      const cartDetailsIndex: TableIndex[] =
        cartDetailsTableCreated.indices || [];

      /*
       * Check if `idx_cart_details_id` not exist
       * */
      if (
        !cartDetailsIndex.find(
          (i: TableIndex): boolean => i.name === 'idx_cart_details_id',
        )
      ) {
        await queryRunner.createIndex(
          cartDetailsTableCreated,
          new TableIndex({
            name: 'idx_cart_details_id',
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
     * Get `cart_details` table after created
     * */
    const cartDetailsTableCreated: Table | undefined =
      await queryRunner.getTable('cart_details');

    /*
     * If `cart_details` table exist
     * */
    if (cartDetailsTableCreated) {
      /*
       * Get all foreign key constraints in `cart_details` table
       * */
      const cartDetailsFks: TableForeignKey[] =
        cartDetailsTableCreated.foreignKeys || [];

      /*
       * Check if fk `fk_cart_details_cart_id_to_carts_id` exist
       * */
      if (
        cartDetailsFks.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_cart_details_cart_id_to_carts_id',
        )
      ) {
        /*
         * Drop fk `fk_cart_details_cart_id_to_carts_id`
         * */
        await queryRunner.dropForeignKey(
          cartDetailsTableCreated,
          'fk_cart_details_cart_id_to_carts_id',
        );
      }

      /*
       * Check if fk `fk_cart_details_product_id_to_products_id` exist
       * */
      if (
        cartDetailsFks.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_cart_details_product_id_to_products_id',
        )
      ) {
        /*
         * Drop fk `fk_cart_details_product_id_to_products_id`
         * */
        await queryRunner.dropForeignKey(
          cartDetailsTableCreated,
          'fk_cart_details_product_id_to_products_id',
        );
      }

      /*
       * Get all index in `cart_details` table
       * */
      const cartDetailsIndex: TableIndex[] =
        cartDetailsTableCreated.indices || [];

      /*
       * Check if `idx_cart_details_id` exist
       * */
      if (
        cartDetailsIndex.find(
          (i: TableIndex): boolean => i.name === 'idx_cart_details_id',
        )
      ) {
        await queryRunner.dropIndex(
          cartDetailsTableCreated,
          'idx_cart_details_id',
        );
      }
    }
  }
}
