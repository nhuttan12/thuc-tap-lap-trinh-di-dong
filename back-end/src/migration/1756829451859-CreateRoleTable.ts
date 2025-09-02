/*
 * @description: Migration file for create table
 * @author: Nhut Tan
 * @date: 2025/09/02
 * @version: 1.0.0
 * */

import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateRoleTable1756829451859 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            default: Date.now(),
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: Date.now(),
          },
        ],
      }),
    );

    await queryRunner.createIndices('roles', [
      new TableIndex({
        name: 'idx_roles_id',
        columnNames: ['id'],
      }),
      new TableIndex({
        name: 'idx_roles_name',
        columnNames: ['name'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('roles', 'idx_roles');
    await queryRunner.dropTable('roles');
  }
}
