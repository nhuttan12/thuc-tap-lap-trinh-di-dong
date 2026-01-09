/**
 * @description Create products table
 * @author Nhut Tan
 * @since 2025-01-08
 * @version 1.0.0
 */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductsTable1767890470644 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined = await queryRunner.getTable('products');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'products',
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
							name: 'price',
							type: 'numeric',
							isNullable: false,
						},
						{
							name: 'discount',
							type: 'numeric',
							precision: 2,
							isNullable: false,
							default: 0,
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
		const table: Table | undefined = await queryRunner.getTable('products');

		if (table) {
			await queryRunner.dropTable('products');
		}
	}
}
