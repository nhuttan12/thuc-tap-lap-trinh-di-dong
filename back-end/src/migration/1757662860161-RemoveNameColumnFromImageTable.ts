/*
 * @description: Migration remove `name` column from `image` table
 * @author: Nhut Tan
 * @date: 2025/09/07
 * @version: 1.0.0
 * */

import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class RemoveNameColumnFromImageTable1757662860161
  implements MigrationInterface
{
  /*
   * @description: Migration run removing `name` column from `image` table
   * @author: Nhut Tan
   * @date: 2025/09/07
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `image` table if exist
     * */
    const imageTable: Table | undefined = await queryRunner.getTable('image');

    /*
     * Check `image` table existence
     * */
    if (!imageTable) return;

    /*
     * Get `name` columns in `image` table if exist
     * */
    const nameColumn: TableColumn | undefined = imageTable.columns.find(
      (column: TableColumn): boolean => column.name === 'name',
    );

    /*
     * Check column `name` in `image` table existence
     * */
    if (!nameColumn) return;

    /*
     * Remove `name` column in `image` table
     * */
    await queryRunner.dropColumn(imageTable, nameColumn);
  }

  /*
   * @description: Migration revert removing `name` column from `image` table
   * @author: Nhut Tan
   * @date: 2025/09/07
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `image` table if exist
     * */
    const imageTable: Table | undefined = await queryRunner.getTable('image');

    /*
     * Check `image` table existence
     * */
    if (!imageTable) return;

    /*
     * Get `name` columns in `image` table if exist
     * */
    const nameColumn: TableColumn | undefined = imageTable.columns.find(
      (column: TableColumn): boolean => column.name === 'name',
    );

    /*
     * Check column `name` in `image` table existence
     * */
    if (nameColumn) return;

    /*
     * Create `name` column in `image` table
     * */
    await queryRunner.addColumn(
      imageTable,
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }
}
