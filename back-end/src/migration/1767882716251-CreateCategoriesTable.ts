/**
 * @description Create categories table
 * @author Nhut Tan
 * @since 2025-01-08
 * @version 1.0.0
 */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCategoriesTable1767882716251 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('categories');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'categories',
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
		const table: Table | undefined =
			await queryRunner.getTable('categories');

		if (table) {
			await queryRunner.dropTable('categories');
		}
	}
}
