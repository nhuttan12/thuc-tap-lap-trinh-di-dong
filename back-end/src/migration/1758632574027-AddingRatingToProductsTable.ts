/**
 * @description Migration to add rating to products table
 * @author Nhut Tan
 * @since 2025/09/23
 * @version 1.0.0
 */
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddingRatingToProductsTable1758632574027
  implements MigrationInterface
{
  /**
   * @description Adding rating to products table
   * @param queryRunner
   * @author Nhut Tan
   * @since 2025/09/23
   * @version 1.0.0
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Get `products` table if exist
     */
    const productTable: Table | undefined =
      await queryRunner.getTable('products');

    /**
     * Check exist `products` table
     */
    if (!productTable) return;

    /**
     * Get `rating` columns to `products` table if exist
     */
    const ratingColumn: TableColumn | undefined = productTable.columns.find(
      (column: TableColumn): boolean => column.name === 'rating',
    );

    /**
     * if `rating` column not exist, create new one
     */
    if (!ratingColumn) {
      await queryRunner.addColumn(
        productTable,
        new TableColumn({
          name: 'rating',
          type: 'decimal',
          isNullable: true,
        }),
      );
    }
  }

  /**
   * @description Remove rating from products table
   * @param queryRunner
   * @author Nhut Tan
   * @since 2025/09/23
   * @version 1.0.0
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * Get `products` table if exist
     */
    const productTable: Table | undefined =
      await queryRunner.getTable('products');

    /**
     * Check exist `products` table
     */
    if (!productTable) return;

    /**
     * Get `rating` columns to `products` table if exist
     */
    const ratingColumn: TableColumn | undefined = productTable.columns.find(
      (column: TableColumn): boolean => column.name === 'rating',
    );

    /**
     * if `rating` column exist, drop it
     */
    if (ratingColumn) {
      await queryRunner.dropColumn(productTable, ratingColumn);
    }
  }
}
