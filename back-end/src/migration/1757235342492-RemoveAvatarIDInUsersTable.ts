/*
 * @description: Migration remove `avatar_id` in `users` table
 * @author: Nhut Tan
 * @date: 2025/09/07
 * @version: 1.0.0
 * */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class RemoveAvatarIDInUsersTable1757235342492
  implements MigrationInterface
{
  /*
   * @description: Migration run removing `avatar_id` in `users` table
   * @author: Nhut Tan
   * @date: 2025/09/07
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `users` table if exist
     * */
    const usersTable: Table | undefined = await queryRunner.getTable('users');

    /*
     * Check if `users` table not exist
     * */
    if (!usersTable) return;

    /*
     * Get fk named `fk_users_avatar_id_to_images_id` if exist in `users` table
     * */
    const fkUsersAvatarIdToImagesId: TableForeignKey | undefined =
      usersTable.foreignKeys.find(
        (fk: TableForeignKey): boolean =>
          fk.name === 'fk_users_avatar_id_to_images_id',
      );

    /*
     * Check fk named `fk_users_avatar_id_to_images_id` not exist in `users` table
     * */
    if (!fkUsersAvatarIdToImagesId) return;

    /*
     * Drop fk named `fk_users_avatar_id_to_images_id` in `users` table
     * */
    await queryRunner.dropForeignKey(usersTable, fkUsersAvatarIdToImagesId);

    /*
     * Get `avatar_id` column if exist in `users` table
     * */
    const avatarIdColumn: TableColumn | undefined = usersTable.columns.find(
      (column: TableColumn): boolean => column.name === 'avatar_id',
    );

    /*
     * Check `avatar_id` column not exist in `users` table
     * */
    if (!avatarIdColumn) return;

    /*
     * Drop `avatar_id` column in `users` table
     * */
    await queryRunner.dropColumn(usersTable, avatarIdColumn);
  }

  /*
   * @description: Migration revert removing `avatar_id` in `users` table
   * @author: Nhut Tan
   * @date: 2025/09/07
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `users` table if exist
     * */
    const usersTable: Table | undefined = await queryRunner.getTable('users');

    /*
     * Check if `users` table not exist
     * */
    if (!usersTable) return;

    /*
     * Get `avatar_id` column if exist in `users` table
     * */
    const avatarIdColumn: TableColumn | undefined = usersTable.columns.find(
      (column: TableColumn): boolean => column.name === 'avatar_id',
    );

    /*
     * Check `avatar_id` column exist in `users` table
     * */
    if (avatarIdColumn) return;

    /*
     * Create `avatar_id` column in `users` table
     * */
    await queryRunner.dropColumn(
      usersTable,
      new TableColumn({
        name: 'avatar_id',
        type: 'integer',
        isNullable: true,
      }),
    );

    /*
     * Get fk named `fk_users_avatar_id_to_images_id` if exist in `users` table
     * */
    const fkUsersAvatarIdToImagesId: TableForeignKey | undefined =
      usersTable.foreignKeys.find(
        (fk: TableForeignKey): boolean =>
          fk.name === 'fk_users_avatar_id_to_images_id',
      );

    /*
     * Check fk named `fk_users_avatar_id_to_images_id` exist in `users` table
     * */
    if (fkUsersAvatarIdToImagesId) return;

    /*
     * Create fk named `fk_users_avatar_id_to_images_id` in `users` table
     * */
    await queryRunner.createForeignKey(
      usersTable,
      new TableForeignKey({
        name: 'fk_users_avatar_id_to_images_id',
        columnNames: ['avatar_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'images',
      }),
    );
  }
}
