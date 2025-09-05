/*
 * @description: Migration to add avatar to users table
 * @author: Nhut Tan
 * @date: 2025/09/05
 * @version: 1.0.0
 * */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddAvatarToUsersTable1757075353222 implements MigrationInterface {
  /*
   * @description: Migration up add avatar to users table and create foreign key
   * @author: Nhut Tan
   * @date: 2025/09/05
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get users table if exists
     * */
    const usersTable: Table | undefined = await queryRunner.getTable('users');

    if (usersTable) {
      /*
       * Add column avatar_id to `users` table
       * */
      if (!usersTable.findColumnByName('avatar_id')) {
        await queryRunner.addColumn(
          usersTable,
          new TableColumn({
            name: 'avatar_id',
            type: 'integer',
            isNullable: true,
          }),
        );
      }

      /*
       * Get all foreign keys in `users` table
       * */
      const existingFks: TableForeignKey[] = usersTable.foreignKeys || [];

      /*
       * Create foreign key for `users` table named
       * `fk_users_avatar_id_to_images_id` preference to `id`
       * in `images` table
       * */
      if (
        !existingFks.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_users_avatar_id_to_images_id',
        )
      ) {
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
  }

  /*
   * @description: Migration revert adding avatar to users table and create foreign key
   * @author: Nhut Tan
   * @date: 2025/09/05
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get users table if exists
     * */
    const usersTable: Table | undefined = await queryRunner.getTable('users');

    if (usersTable) {
      /*
       * Get all foreign keys in `users` table
       * */
      const existingFks: TableForeignKey[] = usersTable.foreignKeys || [];

      /*
       * Create foreign key for `users` table named
       * `fk_users_avatar_id_to_images_id` preference to `id`
       * in `images` table
       * */
      if (
        existingFks.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_users_avatar_id_to_images_id',
        )
      ) {
        await queryRunner.dropForeignKey(
          usersTable,
          'fk_users_avatar_id_to_images_id',
        );
      }
    }
  }
}
