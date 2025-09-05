/*
 * @description: Migration to create product_details table
 * @author: Nhut Tan
 * @date: 2025/09/05
 * @version: 1.0.0
 * */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateProductDetailsTable1757075759428
  implements MigrationInterface
{
  /*
   * @description: Migration up creating product_details table
   * @author: Nhut Tan
   * @date: 2025/09/05
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get product detail table if exists
     * */
    const productDetailsTable: Table | undefined =
      await queryRunner.getTable('product_details');

    /*
     * Check product detail table if not exists, create it
     * */
    if (!productDetailsTable) {
      await queryRunner.createTable(
        new Table({
          name: 'product_details',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              isNullable: false,
            },
            {
              name: 'size',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'color',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'description',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'category_id',
              type: 'integer',
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
     * Get created `product_details` table
     * */
    const createdProductDetailsTable: Table | undefined =
      await queryRunner.getTable('product_details');

    /*
     * If `product_details` table exist, create foreign key to `categories` table
     * */
    if (createdProductDetailsTable) {
      /*
       * Get all `product_details` foreign keys
       * */
      const productDetailsFk: TableForeignKey[] =
        createdProductDetailsTable.foreignKeys || [];

      /*
       * Create foreign key for `product_details` table named
       * `fk_product_detail_category_id_to_categories_id` preference to `id`
       * in `categories` table
       * */
      if (
        !productDetailsFk.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_product_detail_category_id_to_categories_id',
        )
      ) {
        await queryRunner.createForeignKey(
          createdProductDetailsTable,
          new TableForeignKey({
            name: 'fk_product_detail_category_id_to_categories_id',
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'categories',
          }),
        );
      }

      /*
       * Create foreign key for `product_details` table named
       * `fk_product_details_id_to_products_id` preference to `id`
       * in `products` table
       * */
      if (
        !productDetailsFk.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_product_details_id_to_products_id',
        )
      ) {
        await queryRunner.createForeignKey(
          createdProductDetailsTable,
          new TableForeignKey({
            name: 'fk_product_details_id_to_products_id',
            columnNames: ['id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'products',
          }),
        );
      }

      /*
       * Get all index in `product_details` table
       * */
      const tableIndices: TableIndex[] =
        createdProductDetailsTable.indices || [];

      if (!tableIndices) {
        /*
         * Create index for `id` column named `idx_product_details_id` if not exists
         * */
        await queryRunner.createIndex(
          createdProductDetailsTable,
          new TableIndex({
            name: 'idx_product_details_id',
            columnNames: ['id'],
          }),
        );
      }
    }
  }

  /*
   * @description: Migration revert creating product_details table
   * @author: Nhut Tan
   * @date: 2025/09/05
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get product detail table if exists
     * */
    const productDetailsTable: Table | undefined =
      await queryRunner.getTable('product_details');

    /*
     * Check product detail table if not exists, create it
     * */
    if (productDetailsTable) {
      /*
       * Get all index in `product_details` table
       * */
      const tableIndices: TableIndex[] = productDetailsTable.indices || [];

      /*
       * If `product_details` table has index, drop it
       * */
      if (tableIndices.length > 0) {
        await queryRunner.dropIndices(productDetailsTable, tableIndices);
      }

      /*
       * Get all foreign key in `product_details` table
       * */
      const productDetailsFk: TableForeignKey[] =
        productDetailsTable.foreignKeys || [];

      /*
       * If `product_details` table has foreign key, drop it
       * */
      if (productDetailsFk.length > 0) {
        await queryRunner.dropForeignKeys(
          productDetailsTable,
          productDetailsFk,
        );
      }

      /*
       * Drop `product_details` table
       * */
      await queryRunner.dropTable(productDetailsTable);
    }
  }
}
