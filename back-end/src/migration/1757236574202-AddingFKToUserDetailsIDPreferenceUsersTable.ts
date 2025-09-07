/*
 * @description: Migration add fk to `id` in `user_details`
 * table references to `id` in `users` table
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

export class AddingFKToUserDetailsIDPreferenceUsersTable1757236574202
  implements MigrationInterface
{
  /*
   * @description: Migration run adding fk to `user_details_id` in `user_details`
   * table references to `id` in `users` table
   * @author: Nhut Tan
   * @date: 2025/09/07
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `user_details` table
     * */
    const userDetailTable: Table | undefined =
      await queryRunner.getTable('user_details');

    /*
     * Check if `user_details` table not exists
     * */
    if (!userDetailTable) return;

    /*
     * Get foreign keys of `user_details` table in `id` column preference
     * to `id` column in `users` table
     * */
    const foreignKeys: boolean = userDetailTable.foreignKeys.some(
      (fk: TableForeignKey): boolean => {
        return (
          fk.referencedTableName === 'users' &&
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
     * Create foreign key named `fk_user_details_id_to_users_id`
     * */
    await queryRunner.createForeignKey(
      userDetailTable,
      new TableForeignKey({
        name: 'fk_user_details_id_to_users_id',
        columnNames: ['id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    );
  }

  /*
   * @description: Migration revert adding fk to `user_details_id` in `user_details`
   * table references to `id` in `users` table
   * @author: Nhut Tan
   * @date: 2025/09/07
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `user_details` table
     * */
    const userDetailTable: Table | undefined =
      await queryRunner.getTable('user_details');

    /*
     * Check if `user_details` table not exists
     * */
    if (!userDetailTable) return;

    /*
     * Get foreign keys of `user_details` table in `id` column preference
     * to `id` column in `users` table
     * */
    const foreignKeys: boolean = userDetailTable.foreignKeys.some(
      (fk: TableForeignKey): boolean => {
        return (
          fk.referencedTableName === 'users' &&
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
     * Drop foreign key named `fk_user_details_id_to_users_id`
     * */
    await queryRunner.dropForeignKey(
      userDetailTable,
      'fk_user_details_id_to_users_id',
    );
  }
}
