/*
 * @description: Migration to change product price type from integer to double precision
 * @author: Nhut Tan
 * @date: 2025/09/05
 * @version: 1.0.0
 * */

import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class ChangeProductPriceToDoublePresicion1757087302315
  implements MigrationInterface
{
  /*
   * @description: Migration up changing product price type from integer to double precision
   * @author: Nhut Tan
   * @date: 2025/09/05
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `products` table if exists
     * */
    const productsTable: Table | undefined =
      await queryRunner.getTable('products');

    /*
     * Check if `products` table exists
     * */
    if (productsTable) {
      /*
       * Check if `price` column exists in `products` table
       * */
      if (productsTable.findColumnByName('price')) {
        /*
         * Change `price` column from integer to double precision
         * */
        await queryRunner.changeColumn(
          productsTable,
          'price',
          new TableColumn({
            name: 'price',
            type: 'double precision',
            isNullable: false,
            default: 0.0,
          }),
        );
      }
    }
  }

  /*
   * @description: Migration revert changing product price type from double precision to integer
   * @author: Nhut Tan
   * @date: 2025/09/05
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `products` table if exists
     * */
    const productsTable: Table | undefined =
      await queryRunner.getTable('products');

    /*
     * Check if `products` table exists
     * */
    if (productsTable) {
      /*
       * Check if `price` column exists in `products` table
       * */
      if (productsTable.findColumnByName('price')) {
        /*
         * Change `price` column from double precision to integer
         * */
        await queryRunner.changeColumn(
          productsTable,
          'price',
          new TableColumn({
            name: 'price',
            type: 'integer',
            isNullable: false,
            default: 0.0,
          }),
        );
      }
    }
  }
}
