/*
 * @description: Migration file for create roles table
 * @author: Nhut Tan
 * @date: 2025/09/02
 * @modified: 2025/09/04
 * @modifiedBy: Nhut Tan
 * @version: 1.0.3
 * */

import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateRoleTable1756829451859 implements MigrationInterface {
  /*
   * @description: Run migration
   * @author: Nhut Tan
   * @date: 2025/09/02
   * @modified: 2025/09/04
   * @modifiedBy: Nhut Tan
   * @version: 1.0.3
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Check if table roles exists
     * */
    const rolesTable: Table | undefined = await queryRunner.getTable('roles');

    /*
     * Create new role table if not exists
     * */
    if (!rolesTable) {
      await queryRunner.createTable(
        new Table({
          name: 'roles',
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
     * Get all existing index in `roles` table
     * */
    const tableIndices: TableIndex[] = await queryRunner
      .getTable('roles')
      .then((t: Table | undefined): TableIndex[] => t?.indices || []);

    /*
     * Create index for `id` column named `idx_roles_id` if not exists
     * */
    if (
      !tableIndices.find((i: TableIndex): string => (i.name = 'idx_roles_id'))
    ) {
      await queryRunner.createIndex(
        'roles',
        new TableIndex({
          name: 'idx_roles_id',
          columnNames: ['id'],
        }),
      );
    }

    /*
     * Create index for `name` column named `idx_roles_name` if not exists
     * */
    if (
      !tableIndices.find(
        (i: TableIndex): string => (i.name = 'idx_roles_name'),
      )
    ) {
      await queryRunner.createIndex(
        'roles',
        new TableIndex({
          name: 'idx_roles_name',
          columnNames: ['name'],
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
    await queryRunner.dropIndex('roles', 'idx_roles');
    await queryRunner.dropTable('roles');
  }
}
