/**
 * @description Create product_images table
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

export class CreateProductImagesTable1767890514331
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('product_images');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'product_images',
					columns: [
						{
							name: 'id',
							type: 'int',
							isPrimary: true,
							isGenerated: true,
							generationStrategy: 'increment',
						},
						{
							name: 'image_id',
							type: 'int',
							isNullable: false,
						},
						{
							name: 'product_id',
							type: 'int',
							isNullable: false,
						},
						{
							name: 'type',
							type: 'enum',
							enum: ['THUMBNAIL', 'PRODUCT', 'BANNER'],
							default: `'PRODUCT'`,
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
			await queryRunner.getTable('product_images');
		const hasImageIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_product_images_image_id_to_images_id'
			);
		const hasProductIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_product_images_product_id_to_products_id'
			);

		if (!hasImageIDFk) {
			await queryRunner.createForeignKey(
				'product_images',
				new TableForeignKey({
					name: 'fk_product_images_image_id_to_images_id',
					columnNames: ['image_id'],
					referencedTableName: 'images',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}

		if (!hasProductIDFk) {
			await queryRunner.createForeignKey(
				'product_images',
				new TableForeignKey({
					name: 'fk_product_images_product_id_to_products_id',
					columnNames: ['product_id'],
					referencedTableName: 'products',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('product_images');

		if (table) {
			const hasImageIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name === 'fk_product_images_image_id_to_images_id'
				);
			const hasProductIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name ===
						'fk_product_images_product_id_to_products_id'
				);

			if (hasProductIDFk) {
				await queryRunner.dropForeignKey(
					'product_images',
					hasProductIDFk
				);
			}

			if (hasImageIDFk) {
				await queryRunner.dropForeignKey(
					'product_images',
					hasImageIDFk
				);
			}

			await queryRunner.dropTable('product_images');
		}
	}
}
