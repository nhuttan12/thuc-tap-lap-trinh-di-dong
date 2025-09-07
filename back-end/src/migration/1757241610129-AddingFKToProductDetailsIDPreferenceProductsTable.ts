/*
 * @description: Migration add fk to `id` in `product_details`
 * table references to `id` in `products` table
 * @author: Nhut Tan
 * @date: 2025/09/07
 * @version: 1.0.0
 * */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddingFKToProductDetailsIDPreferenceProductsTable1757241610129
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `product_details` table
     * */
    const productDetailTable: Table | undefined =
      await queryRunner.getTable('product_details');

    /*
     * Check if `product_details` table not exists
     * */
    if (!productDetailTable) return;

    /*
     * Get foreign keys of `product_details` table in `id` column preference
     * to `id` column in `products` table
     * */
    const foreignKeys: boolean = productDetailTable.foreignKeys.some(
      (fk: TableForeignKey): boolean => {
        return (
          fk.referencedTableName === 'products' &&
          fk.columnNames.includes('id') &&
          fk.referencedColumnNames.includes('id')
        );
      },
    );

    /*
     * Check if foreign key exists
     * */
    if (foreignKeys) return;

    /*
     * Create foreign key named `fk_product_details_id_to_products_id`
     * */
    await queryRunner.createForeignKey(
      productDetailTable,
      new TableForeignKey({
        name: 'fk_product_details_id_to_products_id',
        columnNames: ['id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `product_details` table
     * */
    const userDetailTable: Table | undefined =
      await queryRunner.getTable('product_details');

    /*
     * Check if `product_details` table not exists
     * */
    if (!userDetailTable) return;

    /*
     * Get foreign keys of `product_details` table in `id` column preference
     * to `id` column in `products` table
     * */
    const foreignKeys: boolean = userDetailTable.foreignKeys.some(
      (fk: TableForeignKey): boolean => {
        return (
          fk.referencedTableName === 'products' &&
          fk.columnNames.includes('id') &&
          fk.referencedColumnNames.includes('id')
        );
      },
    );

    /*
     * Check if foreign key not exists
     * */
    if (!foreignKeys) return;

    /*
     * Drop foreign key named `fk_product_details_id_to_products_id`
     * */
    await queryRunner.dropForeignKey(
      userDetailTable,
      'fk_product_details_id_to_products_id',
    );
  }
}
