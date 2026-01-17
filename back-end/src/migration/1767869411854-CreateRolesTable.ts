/**
 * @description Create roles table
 * @author Nhut Tan
 * @since 2025-01-08
 * @version 1.0.0
 */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRolesTable1767869411854 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined = await queryRunner.getTable('roles');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'roles',
					columns: [
						{
							name: 'id',
							type: 'int',
							isPrimary: true,
							isGenerated: true,
							generationStrategy: 'increment',
						},
						{
							name: 'name',
							type: 'varchar',
							isNullable: false,
						},
						{
							name: 'status',
							type: 'enum',
							enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
							default: `'ACTIVE'`,
							isNullable: false,
						},
						{
							name: 'created_at',
							type: 'timestamp',
							default: 'CURRENT_TIMESTAMP',
						},
						{
							name: 'updated_at',
							type: 'timestamp',
							default: 'CURRENT_TIMESTAMP',
						},
					],
				})
			);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined = await queryRunner.getTable('roles');

		if (table) {
			await queryRunner.dropTable('roles');
		}
	}
}
