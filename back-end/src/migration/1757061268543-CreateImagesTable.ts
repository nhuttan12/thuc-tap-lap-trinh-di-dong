/*
 * @description: Migration to create images table
 * @author: Nhut Tan
 * @date: 2025/09/05
 * @version: 1.0.0
 * */

import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { ImageTypeEnum } from '../modules/image/enums/image-type.enum';
import { ImageStatusEnum } from '../modules/image/enums/image-status.enum';

export class CreateImagesTable1757061268543 implements MigrationInterface {
  /*
   * @description: Migration up to create images table
   * @author: Nhut Tan
   * @date: 2025/09/05
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get images table
     * */
    const imagesTable: Table | undefined = await queryRunner.getTable('images');

    if (!imagesTable) {
      await queryRunner.createTable(
        new Table({
          name: 'images',
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
              name: 'url',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'type',
              type: 'enum',
              enumName: 'image_type_enum',
              enum: Object.values(ImageTypeEnum),
              isNullable: false,
            },
            {
              name: 'status',
              type: 'enum',
              enumName: 'image_status_enum',
              enum: Object.values(ImageStatusEnum),
              default: `'${ImageStatusEnum.ACTIVE}'`,
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
     * Check if images table exist
     * */
    if (imagesTable) {
      /*
       * Get all existing index in `images` table
       * */
      const tableIndices: TableIndex[] = imagesTable.indices || [];

      /*
       * Drop index `idx_images_id` if exists
       * */
      if (
        tableIndices.find(
          (i: TableIndex): string => (i.name = 'idx_images_id'),
        )
      ) {
        await queryRunner.createIndex(
          imagesTable,
          new TableIndex({
            name: 'idx_images_id',
            columnNames: ['id'],
          }),
        );
      }
    }
  }

  /*
   * @description: Migration revert to delete image table
   * @author: Nhut Tan
   * @date: 2025/09/05
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get images table
     * */
    const imagesTable: Table | undefined = await queryRunner.getTable('images');

    if (imagesTable) {
      /*
       * Get all existing index in `images` table
       * */
      const tableIndices: TableIndex[] = imagesTable.indices || [];

      /*
       * Drop all index in `images` table
       * */
      if (tableIndices.length > 0) {
        for (const index of tableIndices) {
          await queryRunner.dropIndex(imagesTable, index);
        }
      }

      /*
       * Drop image table
       * */
      await queryRunner.dropTable(imagesTable);
    }
  }
}
