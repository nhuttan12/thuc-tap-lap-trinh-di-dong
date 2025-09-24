/**
 * @description Migration remove `type` column from `images` table
 * @author Nhut Tan
 * @since 2025/09/22
 * @version 1.0.0
 */

import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { ImageTypeEnum } from '../modules/image/enums/image-type.enum';

export class RemoveImageTypeFromImagesTable1758559684095
  implements MigrationInterface
{
  /**
   * Migration run removing `type` column from `images` table
   * @param queryRunner
   * @author Nhut Tan
   * @since 2025/09/22
   * @version 1.0.0
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `images` table if exist
     * */
    const imageTable: Table | undefined = await queryRunner.getTable('images');

    /*
     * Check `images` table existence
     * */
    if (!imageTable) return;

    /*
     * Get `type` column in `images` table if exist
     * */
    const nameColumn: TableColumn | undefined = imageTable.columns.find(
      (column: TableColumn): boolean => column.name === 'type',
    );

    /*
     * Check column `type` in `images` table existence
     * */
    if (!nameColumn) return;

    /*
     * Remove `type` column in `images` table
     * */
    await queryRunner.dropColumn(imageTable, nameColumn);
  }

  /**
   * Migration revert removing `type` column from `images` table
   * @param queryRunner
   * @author Nhut Tan
   * @since 2025/09/22
   * @version 1.0.0
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `images` table if exist
     * */
    const imageTable: Table | undefined = await queryRunner.getTable('images');

    /*
     * Check `images` table existence
     * */
    if (!imageTable) return;

    /*
     * Get `type` columns in `images` table if exist
     * */
    const nameColumn: TableColumn | undefined = imageTable.columns.find(
      (column: TableColumn): boolean => column.name === 'name',
    );

    /*
     * Check column `type` in `images` table existence
     * */
    if (nameColumn) return;

    /*
     * Create `type` column in `images` table
     * */
    await queryRunner.addColumn(
      imageTable,
      new TableColumn({
        name: 'type',
        enumName: 'image_type_enum',
        type: 'enum',
        enum: Object.values(ImageTypeEnum),
        default: `'${ImageTypeEnum.AVATAR}'`,
        isNullable: false,
      }),
    );
  }
}
