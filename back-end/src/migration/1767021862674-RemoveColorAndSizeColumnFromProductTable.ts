/**
 * @description Migration remove `color` column from `products` table
 * @author Nhut Tan
 * @since 2025-12-29
 * @modifes 2025-12-30
 * @version 1.0.1
 */

import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class RemoveColorAndSizeColumnFromProductTable1767021862674
	implements MigrationInterface
{
	/**
	 * @description Migration run remove `color` column from `products` table
	 */
	public async up(queryRunner: QueryRunner): Promise<void> {
		/**
		 * Get `products` table if exist
		 */
		const productsTable: Table | undefined =
			await queryRunner.getTable('products');

		/**
		 * Check `products` table existence, if not exist, then return
		 */
		if (!productsTable) return;

		/**
		 * Get `color` column from `products` table if exist
		 */
		const colorColumn: TableColumn | undefined = productsTable.columns.find(
			(column: TableColumn): boolean => {
				return column.name === 'color' && column.type === 'text';
			}
		);

		/**
		 * Check `color` column existence in `products` table, if exist, then drop it
		 */
		if (colorColumn) {
			/**
			 * Drop `color` column
			 */
			await queryRunner.dropColumn(productsTable, colorColumn);
		}

		/**
		 * Get `size` column from `products` table if exist
		 */
		const sizeColumn: TableColumn | undefined = productsTable.columns.find(
			(column: TableColumn): boolean => {
				return column.name === 'size' && column.type === 'text';
			}
		);

		/**
		 * Check `size` column existence in `products` table, if exist, then drop it
		 */
		if (sizeColumn) {
			/**
			 * Drop `size` column
			 */
			await queryRunner.dropColumn(productsTable, sizeColumn);
		}
	}

	/**
	 * @description Migration revert add `color` column from `products` table
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
		 * Check if `size` column exist in `products` table, if not exist, then create it
		 */
		if (!sizeColumn) {
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
		}

		/**
		 * Get `color` column to `products` table if exist
		 */
		const colorColumn: TableColumn | undefined = productsTable.columns.find(
			(column: TableColumn): boolean => column.name === 'color'
		);

		/**
		 * Check if `color` column exist in `products` table, if not exist, then create `color` column
		 */
		if (!colorColumn) {
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
	}
}
