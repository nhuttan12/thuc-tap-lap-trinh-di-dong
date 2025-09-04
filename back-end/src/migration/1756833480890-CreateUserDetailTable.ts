/*
 * @description: Migration file for create user_details table
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

export class CreateUserDetailTable1756833480890 implements MigrationInterface {
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
    const userDetailsTable: Table | undefined =
      await queryRunner.getTable('user_details');

    /*
     * Create new `user_details` table if not exists
     * */
    if (!userDetailsTable) {
      await queryRunner.createTable(
        new Table({
          name: 'user_details',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              isNullable: false,
            },
            {
              name: 'address_1',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'address_2',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'address_3',
              type: 'text',
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
     * Get all foreign keys in `user_details` table
     * */
    const existingFks: TableForeignKey[] =
      (await queryRunner.getTable('user_details'))?.foreignKeys || [];

    /*
     * Create foreign key for `id` named `fk_user_details_id_to_users_id` column if not exists
     * */
    if (
      !existingFks.find(
        (fk: TableForeignKey): boolean =>
          fk.name === 'fk_user_details_id_to_users_id',
      )
    ) {
      await queryRunner.createForeignKey(
        'user_details',
        new TableForeignKey({
          name: 'fk_user_details_id_to_users_id',
          columnNames: ['id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
        }),
      );
    }

    /*
     * Get all existing index in `users` table
     * */
    const existingIndexs: TableIndex[] =
      (await queryRunner.getTable('user_details'))?.indices || [];

    /*
     * Create index for `id` column named `idx_user_details_id` if not exists
     * */
    if (
      !existingIndexs.find(
        (i: TableIndex): string => (i.name = 'idx_user_details_id'),
      )
    ) {
      await queryRunner.createIndex(
        'user_details',
        new TableIndex({
          name: 'idx_user_details_id',
          columnNames: ['id'],
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
    await queryRunner.dropIndex(
      'user_details',
      'fk_user_details_id_to_users_id',
    );
    await queryRunner.dropForeignKey(
      'user_details',
      'fk_user_details_id_users_id',
    );
    await queryRunner.dropTable('user_details');
  }
}
