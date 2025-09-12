/*
 * @description: Migration to create products table
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
import { ProductStatusEnum } from '../modules/product/enums/product-status.enum';

export class CreateProductsTable1757072374025 implements MigrationInterface {
  /*
   * @description: Migration up create products table
   * @author: Nhut Tan
   * @date: 2025/09/05
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get products table if exists
     * */
    const productsTable: Table | undefined =
      await queryRunner.getTable('products');

    /*
     * Create products table if not exists
     * */
    if (!productsTable) {
      await queryRunner.createTable(
        new Table({
          name: 'products',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              isNullable: false,
            },
            {
              name: 'name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'price',
              type: 'integer',
              isNullable: false,
            },
            {
              name: 'discount',
              type: 'double precision',
              isNullable: false,
            },
            {
              name: 'status',
              type: 'enum',
              enumName: 'product_status_enum',
              enum: Object.values(ProductStatusEnum),
              default: `'${ProductStatusEnum.ACTIVE}'`,
              isNullable: false,
            },
            {
              name: 'image_id',
              type: 'integer',
              isNullable: true,
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
     * Get created `products` table
     * */
    const createdProductsTable: Table | undefined =
      await queryRunner.getTable('products');

    /*
     * Check if products table exists
     * */
    if (createdProductsTable) {
      /*
       * Get all foreign keys in `products` table
       * */
      const existingFks: TableForeignKey[] =
        createdProductsTable.foreignKeys || [];

      /*
       * Create foreign key for `products` table named
       * `fk_product_image_id_to_images_id` preference to `id`
       * in `images` table
       * */
      if (
        !existingFks.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_product_image_id_to_images_id',
        )
      ) {
        await queryRunner.createForeignKey(
          createdProductsTable,
          new TableForeignKey({
            name: 'fk_product_image_id_to_images_id',
            columnNames: ['image_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'images',
          }),
        );
      }

      /*
       * Get all index in `products` table
       * */
      const tableIndices: TableIndex[] = createdProductsTable.indices || [];

      if (!tableIndices) {
        /*
         * Create index for `id` column named `idx_products_id` if not exists
         * */
        await queryRunner.createIndices(createdProductsTable, [
          new TableIndex({
            name: 'idx_products_id',
            columnNames: ['id'],
          }),
          new TableIndex({
            name: 'idx_products_name',
            columnNames: ['name'],
          }),
        ]);
      }
    }
  }

  /*
   * @description: Migration revert create products table
   * @author: Nhut Tan
   * @date: 2025/09/05
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get products table if exists
     * */
    const productsTable: Table | undefined =
      await queryRunner.getTable('products');

    /*
     * Check if products table exists
     * */
    if (productsTable) {
      /*
       * Get all foreign keys in `products` table
       * */
      const existingFks: TableForeignKey[] = productsTable.foreignKeys || [];

      /*
       * Drop foreign key for `products` table named
       * `fk_product_image_id_to_images_id` if exists
       * */
      if (existingFks.length > 0) {
        await queryRunner.dropForeignKey(
          productsTable,
          'fk_product_image_id_to_images_id',
        );
      }

      /*
       * Drop products table
       * */
      await queryRunner.dropTable(productsTable);
    }
  }
}
