/*
 * @description: Migration to create categories table
 * @author: Nhut Tan
 * @date: 2025/09/05
 * @version: 1.0.0
 * */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { CategoryStatusEnum } from '../modules/category/enums/category-status.enum';
import { ImageStatusEnum } from '../modules/image/enums/image-status.enum';

export class CreateCategoriesTable1757063777816 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get categories table
     * */
    const categoriesTable: Table | undefined =
      await queryRunner.getTable('categories');

    /*
     * Create categories table if not exists
     * */
    if (!categoriesTable) {
      await queryRunner.createTable(
        new Table({
          name: 'categories',
          columns: [
            {
              name: 'id',
              type: 'int',
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
              name: 'status',
              type: 'enum',
              enumName: 'category_status_enum',
              enum: Object.values(CategoryStatusEnum),
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get categories table
     * */
    const categoriesTable: Table | undefined =
      await queryRunner.getTable('categories');

    /*
     * Drop categories table if exists
     * */
    if (categoriesTable) {
      await queryRunner.dropTable(categoriesTable);
    }
  }
}
