/*
 * @description: Migration create `product_images` table
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
import { ProductImageTypeEnum } from '../modules/product/enums/product-image.type.enum';

export class CreateProductImagesTable1757177326850
  implements MigrationInterface
{
  /*
   * @description: Migration run create `product_images` table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `product_images` table if exists
     * */
    const productImagesTable: Table | undefined =
      await queryRunner.getTable('product_images');

    /*
     * Check exist `product_images` table
     * */
    if (!productImagesTable) {
      /*
       * Create `product_images` table
       * */
      await queryRunner.createTable(
        new Table({
          name: 'product_images',
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
              name: 'image_id',
              type: 'integer',
              isNullable: false,
            },
            {
              name: 'product_id',
              type: 'integer',
              isNullable: false,
            },
            {
              name: 'type',
              type: 'enum',
              enum: Object.values(ProductImageTypeEnum),
              default: `'${ProductImageTypeEnum.PRODUCT}'`,
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
     * Get `product_images` table after created
     * */
    const productImagesTableCreated: Table | undefined =
      await queryRunner.getTable('product_images');

    /*
     * Check if `product_images` created
     * */
    if (productImagesTableCreated) {
      /*
       * Get foreign keys in `product_images` table named `fk_product_images_image_id_to_images_id`
       * */
      const imageIDFks: TableForeignKey | undefined =
        productImagesTableCreated.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_product_images_image_id_to_images_id',
        );

      /*
       * Check if `fk_product_images_image_id_to_images_id` not exists
       * */
      if (!imageIDFks) {
        /*
         * Create new foreign key named `fk_product_images_image_id_to_images_id`
         * */
        await queryRunner.createForeignKey(
          productImagesTableCreated,
          new TableForeignKey({
            name: 'fk_product_images_image_id_to_images_id',
            columnNames: ['image_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'images',
          }),
        );
      }

      /*
       * Get foreign keys in `product_images` table named `fk_product_images_product_id_to_products_id`
       * */
      const productIDFks: TableForeignKey | undefined =
        productImagesTableCreated.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_product_images_product_id_to_products_id',
        );

      /*
       * Check if `fk_product_images_product_id_to_products_id` not exists
       * */
      if (!productIDFks) {
        /*
         * Create new foreign key named `fk_product_images_product_id_to_products_id`
         * */
        await queryRunner.createForeignKey(
          productImagesTableCreated,
          new TableForeignKey({
            name: 'fk_product_images_product_id_to_products_id',
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'products',
          }),
        );
      }

      /*
       * Get index in `product_images` table named `idx_product_images_id`
       * */
      const idxID: TableIndex | undefined =
        productImagesTableCreated.indices.find(
          (index: TableIndex): boolean =>
            index.name === 'idx_product_images_id',
        );

      /*
       * Check if `idx_product_images_id` not exists
       * */
      if (!idxID) {
        /*
         * Create new index `idx_product_images_id`
         * */
        await queryRunner.createIndex(
          productImagesTableCreated,
          new TableIndex({
            name: 'idx_product_images_id',
            columnNames: ['id'],
          }),
        );
      }
    }
  }

  /*
   * @description: Migration revert create `product_images` table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `product_images` table after created
     * */
    const productImagesTableCreated: Table | undefined =
      await queryRunner.getTable('product_images');

    /*
     * Check if `product_images` created
     * */
    if (productImagesTableCreated) {
      /*
       * Get foreign keys in `product_images` table named `fk_product_images_image_id_to_images_id`
       * */
      const imageIDFks: TableForeignKey | undefined =
        productImagesTableCreated.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_product_images_image_id_to_images_id',
        );

      /*
       * Check if `fk_product_images_image_id_to_images_id` exists
       * */
      if (imageIDFks) {
        /*
         * Drop foreign key named `fk_product_images_image_id_to_images_id`
         * */
        await queryRunner.dropForeignKey(productImagesTableCreated, imageIDFks);
      }

      /*
       * Get foreign keys in `product_images` table named `fk_product_images_product_id_to_products_id`
       * */
      const productIDFks: TableForeignKey | undefined =
        productImagesTableCreated.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_product_images_product_id_to_products_id',
        );

      /*
       * Check if `fk_product_images_product_id_to_products_id` exists
       * */
      if (productIDFks) {
        /*
         * Drop foreign key named `fk_product_images_product_id_to_products_id`
         * */
        await queryRunner.dropForeignKey(
          productImagesTableCreated,
          productIDFks,
        );
      }

      /*
       * Get index in `product_images` table named `idx_product_images_id`
       * */
      const idxID: TableIndex | undefined =
        productImagesTableCreated.indices.find(
          (index: TableIndex): boolean =>
            index.name === 'idx_product_images_id',
        );

      /*
       * Check if `idx_product_images_id` not exists
       * */
      if (idxID) {
        /*
         * Drop index `idx_product_images_id`
         * */
        await queryRunner.dropIndex(productImagesTableCreated, idxID);
      }

      /*
       * Drop `product_images` table if exist
       * */
      await queryRunner.dropTable(productImagesTableCreated);
    }
  }
}
