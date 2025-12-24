/**
 * @description Migration to add `size` and `color` column to `products` table
 * @author Nhut Tan
 * @since 2025-12-15
 * @version 1.0.0
 */

import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddingSizeToProductsTable1765814695482
	implements MigrationInterface
{
	/**
	 * @description Migration run adding `size` and `color` column to `products` table
	 */
	public async up(queryRunner: QueryRunner): Promise<void> {
		/**
		 * Get `products` table if exist
		 */
		const productsTable: Table | undefined =
			await queryRunner.getTable('products');

		/**
		 * Check `products` table existence, if not exist return
		 */
		if (!productsTable) return;

		/**
		 * Get `size` column to `products` table if exist
		 */
		const sizeColumn: TableColumn | undefined = productsTable.columns.find(
			(column: TableColumn): boolean => column.name === 'size'
		);

		/**
		 * Check if `size` column exist in `products` table, then return
		 */
		if (sizeColumn) return;

		/**
		 * Add `size` column to `products` table
		 */
		await queryRunner.addColumn(
			productsTable,
			new TableColumn({
				name: 'size',
				type: 'text',
				isNullable: false,
			})
		);

		/**
		 * Get `color` column to `products` table if exist
		 */
		const colorColumn: TableColumn | undefined = productsTable.columns.find(
			(column: TableColumn): boolean => column.name === 'color'
		);

		/**
		 * Check if `color` column exist in `products` table, then return
		 */
		if (colorColumn) return;

		/**
		 * Add `color` column to `products` table
		 */
		await queryRunner.addColumn(
			productsTable,
			new TableColumn({
				name: 'color',
				type: 'text',
				isNullable: false,
			})
		);
	}

	/**
	 * @description Migration revert remove `size` and `color` column from `products` table
	 */
	public async down(queryRunner: QueryRunner): Promise<void> {
		/**
		 * Get `products` table if exist
		 */
		const productsTable: Table | undefined =
			await queryRunner.getTable('products');

		/**
		 * Check `products` table existence, if not exist return
		 */
		if (!productsTable) return;

		/**
		 * Get `size` column to `products` table if exist
		 */
		const sizeColumn: TableColumn | undefined = productsTable.columns.find(
			(column: TableColumn): boolean => column.name === 'size'
		);

		/**
		 * Check if `size` column not exist in `products` table, then return
		 */
		if (!sizeColumn) return;

		/**
		 * Add `size` column to `products` table
		 */
		await queryRunner.dropColumn(productsTable, sizeColumn);

		/**
		 * Get `color` column to `products` table if exist
		 */
		const colorColumn: TableColumn | undefined = productsTable.columns.find(
			(column: TableColumn): boolean => column.name === 'color'
		);

		/**
		 * Check if `color` column not exist in `products` table, then return
		 */
		if (!colorColumn) return;

		/**
		 * Add `color` column to `products` table
		 */
		await queryRunner.dropColumn(productsTable, colorColumn);
	}
}
