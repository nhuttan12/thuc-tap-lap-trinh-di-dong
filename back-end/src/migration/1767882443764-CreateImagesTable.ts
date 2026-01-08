/**
 * @description Create images table
 * @author Nhut Tan
 * @since 2025-01-08
 * @version 1.0.0
 */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateImageTable1767882443764 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined = await queryRunner.getTable('images');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'images',
					columns: [
						{
							name: 'id',
							type: 'int',
							isPrimary: true,
							isGenerated: true,
							generationStrategy: 'increment',
						},
						{
							name: 'url',
							type: 'text',
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
		const table: Table | undefined = await queryRunner.getTable('images');

		if (table) {
			await queryRunner.dropTable('images');
		}
	}
}
