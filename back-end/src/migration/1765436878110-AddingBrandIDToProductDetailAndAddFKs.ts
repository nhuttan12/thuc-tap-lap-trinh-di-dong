/**
 * @description Migration to add brand id to product details
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

export class AddingBrandIDToProductDetail1765436878110
	implements MigrationInterface
{
	/**
	 * @description Migration run add brand id to product details
	 */
	public async up(queryRunner: QueryRunner): Promise<void> {
		/**
		 * Get `product-details` table
		 */
		const productDetailsTable: Table | undefined =
			await queryRunner.getTable('product_details');

		/**
		 * Check `product-details` table existence, if not exist, then return
		 */
		if (!productDetailsTable) return;

		/**
		 * Get `brand_id` column in `product_details` table
		 */
		const brandIDColumn: TableColumn | undefined =
			productDetailsTable.columns.find(
				(column: TableColumn): boolean => column.name === 'brand_id'
			);

		/**
		 * Check `brand_id` column in `product_details` table existence, if exist, then return
		 */
		if (brandIDColumn) return;

		/**
		 * Add `brand_id` column to `product_details` table
		 */
		await queryRunner.addColumn(
			productDetailsTable,
			new TableColumn({
				name: 'brand_id',
				type: 'int',
				isNullable: true,
			})
		);

		/**
		 * Get fk named `fk_product_details_brand_id_to_brands_id` if exist in `product_details` table
		 */
		const fkProductDetailsBrandIdToBrandsId: TableForeignKey | undefined =
			productDetailsTable.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_product_details_brand_id_to_brands_id'
			);

		/**
		 * Check fk named `fk_product_details_brand_id_to_brands_id` exist in `product_details` table,
		 * if exist, then return
		 */
		if (fkProductDetailsBrandIdToBrandsId) return;

		/**
		 * Add fk named `fk_product_details_brand_id_to_brands_id` to `product_details` table
		 */
		await queryRunner.createForeignKey(
			productDetailsTable,
			new TableForeignKey({
				name: 'fk_product_details_brand_id_to_brands_id',
				columnNames: ['brand_id'],
				referencedTableName: 'brands',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
			})
		);
	}

	/**
	 * @description Migration revert remove brand id from product details
	 */
	public async down(queryRunner: QueryRunner): Promise<void> {
		/**
		 * Get `product-details` table
		 */
		const productDetailsTable: Table | undefined =
			await queryRunner.getTable('product_details');

		/**
		 * Check `product-details` table existence, if not exist, then return
		 */
		if (!productDetailsTable) return;

		/**
		 * Get fk named `fk_product_details_brand_id_to_brands_id` if exist in `product_details` table
		 */
		const fkProductDetailsBrandIdToBrandsId: TableForeignKey | undefined =
			productDetailsTable.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_product_details_brand_id_to_brands_id'
			);

		/**
		 * Check fk named `fk_product_details_brand_id_to_brands_id` not exist in `product_details` table,
		 * if not exist, then return
		 */
		if (!fkProductDetailsBrandIdToBrandsId) return;

		/**
		 * Remove fk named `fk_product_details_brand_id_to_brands_id` from `product_details` table
		 */
		await queryRunner.dropForeignKey(
			productDetailsTable,
			fkProductDetailsBrandIdToBrandsId
		);

		/**
		 * Get `brand_id` column in `product_details` table
		 */
		const brandIDColumn: TableColumn | undefined =
			productDetailsTable.columns.find(
				(column: TableColumn): boolean => column.name === 'brand_id'
			);

		/**
		 * Check `brand_id` column in `product_details` table existence, if not exist, then return
		 */
		if (!brandIDColumn) return;

		/**
		 * Remove `brand_id` column from `product_details` table
		 */
		await queryRunner.dropColumn(productDetailsTable, brandIDColumn);
	}
}
