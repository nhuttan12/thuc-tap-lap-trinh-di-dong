/**
 * @description Migration to add rating to product_details table
 * @author Nhut Tan
 * @since 2025/09/23
 * @modifies 2025/09/24
 * @version 1.0.1
 */
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm'

export class AddingRatingAndSizeToProductDetailsTable1758632574027
	implements MigrationInterface
{
	/**
	 * @description Adding rating to product_details table
	 * @param queryRunner
	 * @author Nhut Tan
	 * @since 2025/09/23
	 * @modifies 2025/09/24
	 * @version 1.0.1
	 */
	public async up(queryRunner: QueryRunner): Promise<void> {
		/**
		 * Get `product_details` table if exist
		 */
		const productDetailsTable: Table | undefined =
			await queryRunner.getTable('product_details')

		/**
		 * Check if `product_details` table not exist
		 */
		if (!productDetailsTable) return

		/**
		 * Get `rating` columns to `product_details` table if exist
		 */
		const ratingColumn: TableColumn | undefined =
			productDetailsTable.columns.find(
				(column: TableColumn): boolean => column.name === 'rating'
			)

		/**
		 * if `rating` column not exist, create new one
		 */
		if (!ratingColumn) {
			await queryRunner.addColumn(
				productDetailsTable,
				new TableColumn({
					name: 'rating',
					type: 'decimal',
					isNullable: true,
				})
			)
		}

		/**
		 * Get `size` columns to `product_details` table if exist
		 */
		const sizeColumn: TableColumn | undefined =
			productDetailsTable.columns.find(
				(column: TableColumn): boolean => column.name === 'size'
			)

		/**
		 * if `size` column not exist, create new one
		 */
		if (!sizeColumn) {
			await queryRunner.addColumn(
				productDetailsTable,
				new TableColumn({
					name: 'size',
					type: 'decimal',
					isNullable: true,
				})
			)
		}
	}

	/**
	 * @description Remove rating from product_details table
	 * @param queryRunner
	 * @author Nhut Tan
	 * @since 2025/09/23
	 * @modifies 2025/09/24
	 * @version 1.0.1
	 */
	public async down(queryRunner: QueryRunner): Promise<void> {
		/**
		 * Get `product_details` table if exist
		 */
		const productDetailsTable: Table | undefined =
			await queryRunner.getTable('product_details')

		/**
		 * Check exist `product_details` table
		 */
		if (!productDetailsTable) return

		/**
		 * Get `rating` columns to `product_details` table if exist
		 */
		const ratingColumn: TableColumn | undefined =
			productDetailsTable.columns.find(
				(column: TableColumn): boolean => column.name === 'rating'
			)

		/**
		 * if `rating` column exist, drop it
		 */
		if (ratingColumn) {
			await queryRunner.dropColumn(productDetailsTable, ratingColumn)
		}

		/**
		 * Get `size` columns to `product_details` table if exist
		 */
		const sizeColumn: TableColumn | undefined =
			productDetailsTable.columns.find(
				(column: TableColumn): boolean => column.name === 'size'
			)

		/**
		 * if `size` column exist, drop it
		 */
		if (sizeColumn) {
			await queryRunner.dropColumn(productDetailsTable, sizeColumn)
		}
	}
}
