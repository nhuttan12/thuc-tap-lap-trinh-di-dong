/*
 * @description: Migration remove image id on `products` table
 * @author: Nhut Tan
 * @date: 2025/09/06
 * @version: 1.0.0
 * */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class RemoveImageIDOnProductTables1757177316135
  implements MigrationInterface
{
  /*
   * @description: Migration run removing `image_id` column on `products` table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `products` table if exist
     * */
    const productsTable: Table | undefined =
      await queryRunner.getTable('products');

    /*
     * Check if `products` table exist
     * */
    if (productsTable) {
      /*
       * Check if foreign key of `products` table named `fk_product_image_id_to_images_id` exist
       * */
      const existingFks: TableForeignKey | undefined =
        productsTable.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_product_image_id_to_images_id',
        );

      /*
       * If fk `fk_product_image_id_to_images_id` exist
       * */
      if (existingFks) {
        /*
         * Remove foreign key for `products` table named `fk_product_image_id_to_images_id`
         * */
        await queryRunner.dropForeignKey(
          productsTable,
          'fk_product_image_id_to_images_id',
        );
      }

      /*
       * Check if `image_id` column exist in products table
       * */
      const imageIDColumn: TableColumn | undefined = productsTable.columns.find(
        (col: TableColumn): boolean => col.name === 'image_id',
      );

      /*
       * If `image_id` column exist in products table
       * */
      if (imageIDColumn) {
        /*
         * Remove `image_id` column from `products` table
         * */
        await queryRunner.dropColumn(productsTable, 'image_id');
      }
    }
  }

  /*
   * @description: Migration revert removing `image_id` column on `products` table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `products` table if exist
     * */
    const productsTable: Table | undefined =
      await queryRunner.getTable('products');

    /*
     * Check if `products` table not exist
     * */
    if (productsTable) {
      /*
       * Get foreign key of `products` table named `fk_product_image_id_to_images_id`
       * */
      const existingFks: TableForeignKey | undefined =
        productsTable.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_product_image_id_to_images_id',
        );

      /*
       * If fk `fk_product_image_id_to_images_id` not exist
       * */
      if (!existingFks) {
        /*
         * Create foreign key for `products` table named `fk_product_image_id_to_images_id`
         * */
        await queryRunner.createForeignKey(
          productsTable,
          new TableForeignKey({
            name: 'fk_product_image_id_to_images_id',
            columnNames: ['image_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'images',
          }),
        );
      }

      /*
       * Get column in `products` table named `image_id`
       * */
      const imageIDColumn: TableColumn | undefined = productsTable.columns.find(
        (col: TableColumn): boolean => col.name === 'image_id',
      );

      /*
       * If `image_id` column not exist in products table
       * */
      if (!imageIDColumn) {
        /*
         * Create `image_id` column from `products` table
         * */
        await queryRunner.addColumn(
          productsTable,
          new TableColumn({
            name: 'image_id',
            type: 'integer',
            isNullable: true,
          }),
        );
      }
    }
  }
}
