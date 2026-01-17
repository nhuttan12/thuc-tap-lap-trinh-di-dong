/**
 * @description Create product_details table
 * @author Nhut Tan
 * @since 2025-01-08
 * @version 1.0.0
 */

import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class CreateProductDetailTable1767890475527
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('product_details');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'product_details',
					columns: [
						{
							name: 'id',
							type: 'int',
							isPrimary: true,
							isGenerated: true,
						},
						{
							name: 'size',
							type: 'varchar',
							isNullable: true,
						},
						{
							name: 'color',
							type: 'varchar',
							isNullable: true,
						},
						{
							name: 'description',
							type: 'text',
							isNullable: true,
						},
						{
							name: 'rating',
							type: 'numeric',
							isNullable: false,
							default: 0,
						},
						{
							name: 'category_id',
							type: 'int',
							isNullable: false,
						},
						{
							name: 'brand_id',
							type: 'int',
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

		const currentTable: Table | undefined =
			await queryRunner.getTable('product_details');
		const hasCategoryIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name ===
					'fk_product_details_category_id_to_categories_id'
			);
		const hasBrandIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_product_details_brand_id_to_brands_id'
			);

		if (!hasCategoryIDFk) {
			await queryRunner.createForeignKey(
				'product_details',
				new TableForeignKey({
					name: 'fk_product_details_category_id_to_categories_id',
					columnNames: ['category_id'],
					referencedTableName: 'categories',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}

		if (!hasBrandIDFk) {
			await queryRunner.createForeignKey(
				'product_details',
				new TableForeignKey({
					name: 'fk_product_details_brand_id_to_brands_id',
					columnNames: ['brand_id'],
					referencedTableName: 'brands',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('product_details');

		if (table) {
			const hasCategoryIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name ===
						'fk_product_details_category_id_to_categories_id'
				);
			const hasBrandIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name === 'fk_product_details_brand_id_to_brands_id'
				);

			if (hasCategoryIDFk) {
				await queryRunner.dropForeignKey(
					'product_details',
					hasCategoryIDFk
				);
			}

			if (hasBrandIDFk) {
				await queryRunner.dropForeignKey(
					'product_details',
					hasBrandIDFk
				);
			}

			await queryRunner.dropTable('product_details');
		}
	}
}
