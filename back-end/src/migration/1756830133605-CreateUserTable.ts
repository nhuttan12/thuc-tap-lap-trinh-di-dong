/*
 * @description: Migration file for create users table
 * @author: Nhut Tan
 * @date: 2025/09/02
 * @modified: 2025/09/04
 * @modifiedBy: Nhut Tan
 * @version: 1.0.2
 * */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateUserTable1756830133605 implements MigrationInterface {
  /*
   * @description: Run migration
   * @author: Nhut Tan
   * @date: 2025/09/02
   * @modified: 2025/09/04
   * @modifiedBy: Nhut Tan
   * @version: 1.0.2
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Check if users table exists
     * */
    const usersTable: Table | undefined = await queryRunner.getTable('users');

    /*
     * Create new users table if not exists
     * */
    if (!usersTable) {
      await queryRunner.createTable(
        new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              isNullable: false,
            },
            {
              name: 'username',
              type: 'varchar',
              isNullable: false,
              isUnique: true,
            },
            {
              name: 'password',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'email',
              type: 'varchar',
              isNullable: false,
              isUnique: true,
            },
            {
              name: 'full_name',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'role_id',
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
     * Get all foreign keys in `users` table
     * */
    const existingFks: TableForeignKey[] =
      (await queryRunner.getTable('users'))?.foreignKeys || [];

    /*
     * Create foreign key for `role_id` named `fk_user_role_id_to_roles_id` column if not exists
     * */
    if (
      !existingFks.find(
        (fk: TableForeignKey): boolean =>
          fk.name === 'fk_user_role_id_to_roles_id',
      )
    ) {
      await queryRunner.createForeignKey(
        'users',
        new TableForeignKey({
          name: 'fk_user_role_id_to_roles_id',
          columnNames: ['role_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'roles',
        }),
      );
    }

    /*
     * Get all existing index in `users` table
     * */
    const existingIndexs: TableIndex[] =
      (await queryRunner.getTable('users'))?.indices || [];

    /*
     * Create index for `id` column named `idx_user_id` if not exists
     * */
    if (
      !existingIndexs.find((i: TableIndex): string => (i.name = 'idx_user_id'))
    ) {
      await queryRunner.createIndex(
        'users',
        new TableIndex({
          name: 'idx_user_id',
          columnNames: ['id'],
        }),
      );
    }

    /*
     * Create index for `username` column named `idx_user_username` if not exists
     * */
    if (
      !existingIndexs.find(
        (i: TableIndex): string => (i.name = 'idx_user_username'),
      )
    ) {
      await queryRunner.createIndex(
        'users',
        new TableIndex({
          name: 'idx_user_username',
          columnNames: ['username'],
        }),
      );
    }

    /*
     * Create index for `password` column named `idx_user_password` if not exists
     * */
    if (
      !existingIndexs.find(
        (i: TableIndex): string => (i.name = 'idx_user_password'),
      )
    ) {
      await queryRunner.createIndex(
        'users',
        new TableIndex({
          name: 'idx_user_password',
          columnNames: ['password'],
        }),
      );
    }

    /*
     * Create index for `email` column named `idx_user_email` if not exists
     * */
    if (
      !existingIndexs.find(
        (i: TableIndex): string => (i.name = 'idx_user_email'),
      )
    ) {
      await queryRunner.createIndex(
        'users',
        new TableIndex({
          name: 'idx_user_email',
          columnNames: ['email'],
        }),
      );
    }
  }

  /*
   * @description: Revert migration
   * @author: Nhut Tan
   * @date: 2025/09/02
   * @version: 1.0.1
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'idx_user');
    await queryRunner.dropForeignKey('users', 'fk_user_role_id_to_roles_id');
    await queryRunner.dropTable('users');
  }
}
