/**
 * @description Migration to create `wishlist_items` table
 * @author Nhut Tan
 * @since 2025/09/23
 * @version 1.0.0
 */
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { WishlistStatusEnum } from '../modules/wishlist/enums/wishlist-status.enum';

export class CreateWishlistItemsTable1758624384071
  implements MigrationInterface
{
  /**
   * Migration run creating `wishlist_items` table
   * @param queryRunner
   * @author Nhut Tan
   * @since 2025/09/23
   * @version 1.0.0
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Get `wishlist_items` table if exist
     */
    const wishlistItemsTable: Table | undefined =
      await queryRunner.getTable('wishlist_items');

    /**
     * Check if `wishlist_items` table is exist
     */
    if (wishlistItemsTable) return;

    /**
     * Create `wishlist_items` table
     */
    await queryRunner.createTable(
      new Table({
        name: 'wishlist_items',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isNullable: false,
          },
          {
            name: 'product_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(WishlistStatusEnum),
            default: `'${WishlistStatusEnum.ACTIVE}'`,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    /**
     * Get `wishlist_items` table after created
     */
    const wishlistItemsTableAfterCreated: Table | undefined =
      await queryRunner.getTable('wishlist_items');

    /**
     * Check if `wishlist_items` table created
     */
    if (!wishlistItemsTableAfterCreated) return;

    /**
     * Get fk named `fk_product_id_products_id`
     */
    const productIDFk: TableForeignKey | undefined =
      wishlistItemsTableAfterCreated.foreignKeys.find(
        (fk: TableForeignKey): boolean =>
          fk.name === 'fk_product_id_products_id',
      );

    /**
     * Check if fk named `fk_product_id_products_id` not exist
     */
    if (!productIDFk) {
      /**
       * Create new fk named `fk_product_id_products_id` if not exist
       */
      await queryRunner.createForeignKey(
        wishlistItemsTableAfterCreated,
        new TableForeignKey({
          name: 'fk_product_id_products_id',
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
        }),
      );
    }

    /**
     * Get fk named `fk_user_id_users_id`
     */
    const userIDFk: TableForeignKey | undefined =
      wishlistItemsTableAfterCreated.foreignKeys.find(
        (fk: TableForeignKey): boolean => fk.name === 'fk_user_id_users_id',
      );

    /**
     * Check if fk named `fk_user_id_users_id` exist
     */
    if (!userIDFk) {
      /**
       * Create new fk named `fk_user_id_users_id` if not exist
       */
      await queryRunner.createForeignKey(
        wishlistItemsTableAfterCreated,
        new TableForeignKey({
          name: 'fk_user_id_users_id',
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
        }),
      );
    }
  }

  /**
   * Migration run removing `wishlist_items` table
   * @param queryRunner
   * @author Nhut Tan
   * @since 2025/09/23
   * @version 1.0.0
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * Get `wishlist_items` table after created
     */
    const wishlistItemsTableAfterCreated: Table | undefined =
      await queryRunner.getTable('wishlist_items');

    /**
     * Check if `wishlist_items` table created
     */
    if (!wishlistItemsTableAfterCreated) return;

    /**
     * Get fk named `fk_product_id_products_id`
     */
    const productIDFk: TableForeignKey | undefined =
      wishlistItemsTableAfterCreated.foreignKeys.find(
        (fk: TableForeignKey): boolean =>
          fk.name === 'fk_product_id_products_id',
      );

    /**
     * Check if fk named `fk_product_id_products_id` exist
     */
    if (productIDFk) {
      /**
       * Drop fk named `fk_product_id_products_id` if exist
       */
      await queryRunner.dropForeignKey(
        wishlistItemsTableAfterCreated,
        productIDFk,
      );
    }

    /**
     * Get fk named `fk_user_id_users_id`
     */
    const userIDFk: TableForeignKey | undefined =
      wishlistItemsTableAfterCreated.foreignKeys.find(
        (fk: TableForeignKey): boolean => fk.name === 'fk_user_id_users_id',
      );

    /**
     * Check if fk named `fk_user_id_users_id` not exist
     */
    if (userIDFk) {
      /**
       * Drop fk named `fk_user_id_users_id` if exist
       */
      await queryRunner.dropForeignKey(
        wishlistItemsTableAfterCreated,
        userIDFk,
      );
    }

    /**
     * Drop `wishlist_items` table if exist
     */
    await queryRunner.dropTable(wishlistItemsTableAfterCreated);
  }
}
