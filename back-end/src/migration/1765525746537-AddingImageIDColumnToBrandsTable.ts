/**
 * @description Migration to add `image_id` column to `brands` table
 * @author Nhut Tan
 * @since 2025-12-11
 * @version 1.0.0
 */

import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableColumn,
	TableForeignKey,
} from 'typeorm';

export class AddingImageIDColumnToBrandsTable1765525746537
	implements MigrationInterface
{
	/**
	 * @description Migration run add `image_id` column to `brands` table
	 */
	public async up(queryRunner: QueryRunner): Promise<void> {
		/**
		 * Get `brands` table after created
		 */
		const brandsTable: Table | undefined =
			await queryRunner.getTable('brands');

		/**
		 * Check `brands` table after created existence, if not exist, then return
		 */
		if (!brandsTable) return;

		/**
		 * Get `image_id` column in `brands` table
		 */
		const imageIDColumn: TableColumn | undefined = brandsTable.columns.find(
			(column: TableColumn): boolean => column.name === 'image_id'
		);

		/**
		 * Check `image_id` column existence, if exist, then return
		 */
		if (imageIDColumn) return;

		/**
		 * Add `image_id` column to `brands` table
		 */
		await queryRunner.addColumn(
			brandsTable,
			new TableColumn({
				name: 'image_id',
				type: 'int',
				isNullable: false,
			})
		);

		/**
		 * Get fk named `fk_brand_image_id_to_images_id`
		 */
		const existingFks: TableForeignKey | undefined =
			brandsTable.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_brand_image_id_to_images_id'
			);

		/**
		 * If fk `fk_brand_image_id_to_images_id` exist, then return
		 */
		if (existingFks) return;

		/**
		 * Add fk named `fk_brand_image_id_to_images_id`
		 */
		await queryRunner.createForeignKey(
			brandsTable,
			new TableForeignKey({
				name: 'fk_brand_image_id_to_images_id',
				columnNames: ['image_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'images',
				onDelete: 'CASCADE',
			})
		);
	}

	/**
	 * @description Migration revert remove `image_id` column from `brands` table
	 */
	public async down(queryRunner: QueryRunner): Promise<void> {
		/**
		 * Get `brands` table after created
		 */
		const brandsTable: Table | undefined =
			await queryRunner.getTable('brands');

		/**
		 * Check `brands` table after created existence, if not exist, then return
		 */
		if (!brandsTable) return;

		/**
		 * Get `image_id` column in `brands` table
		 */
		const imageIDColumn: TableColumn | undefined = brandsTable.columns.find(
			(column: TableColumn): boolean => column.name === 'image_id'
		);

		/**
		 * Check `image_id` column existence, if not exist, then return
		 */
		if (!imageIDColumn) return;

		/**
		 * Get fk named `fk_brand_image_id_to_images_id`
		 */
		const existingFk: TableForeignKey | undefined =
			brandsTable.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_brand_image_id_to_images_id'
			);

		/**
		 * If fk `fk_brand_image_id_to_images_id` not exist, then return
		 */
		if (!existingFk) return;

		/**
		 * Drop fk named `fk_brand_image_id_to_images_id`
		 */
		await queryRunner.dropForeignKey(brandsTable, existingFk);

		/**
		 * Drop `image_id` column from `brands` table
		 */
		await queryRunner.dropColumn(brandsTable, imageIDColumn);
	}
}
