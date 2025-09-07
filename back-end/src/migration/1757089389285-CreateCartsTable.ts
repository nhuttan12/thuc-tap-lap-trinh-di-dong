/*
 * @description: Migration to create `carts` table
 * @author: Nhut Tan
 * @date: 2025/09/06
 * @version: 1.0.0
 * */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { CartStatusEnum } from '../modules/cart/enums/cart.status.enum';

export class CreateCartsTable1757089389285 implements MigrationInterface {
  /*
   * @description: Migration run creating `carts` table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Get `carts` table if exists
     */
    const cartsTable: Table | undefined = await queryRunner.getTable('carts');

    /*
     * Check if `carts` table not exists
     * */
    if (!cartsTable) {
      /*
       * Create new `carts` table
       * */
      await queryRunner.createTable(
        new Table({
          name: 'carts',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
              isNullable: false,
            },
            {
              name: 'user_id',
              type: 'integer',
              isNullable: false,
            },
            {
              name: 'status',
              type: 'enum',
              enum: Object.values(CartStatusEnum),
              default: `'${CartStatusEnum.ACTIVE}'`,
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
    }

    /*
     * Get `carts` table after created
     * */
    const createdCartsTable: Table | undefined =
      await queryRunner.getTable('carts');

    /*
     * Check if `carts` table exists
     * */
    if (createdCartsTable) {
      /*
       * Get all foreign keys in `carts` table
       * */
      const cartFks: TableForeignKey[] = createdCartsTable.foreignKeys || [];

      /*
       * Check if foreign key named `fk_carts_user_id_to_users_id` is not exists
       * */
      if (
        !cartFks.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_carts_user_id_to_users_id',
        )
      ) {
        /*
         * Create new foreign key named `fk_carts_user_id_to_users_id`
         * */
        await queryRunner.createForeignKey(
          createdCartsTable,
          new TableForeignKey({
            name: 'fk_carts_user_id_to_users_id',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
          }),
        );
      }

      /*
       * Create new index for `id` column
       * */
      const cartIndex: TableIndex[] = createdCartsTable.indices;

      /*
       * Check index named `idx_carts_id` is not exists
       * */
      if (
        !cartIndex.find((i: TableIndex): boolean => i.name === 'idx_carts_id')
      ) {
        /*
         * Create new index named `idx_carts_id`
         * */
        await queryRunner.createIndex(
          'carts',
          new TableIndex({
            name: 'idx_carts_id',
            columnNames: ['id'],
          }),
        );
      }
    }
  }

  /*
   * @description: Migration revert creating `carts` table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * Get `carts` table created if exists
     */
    const createdCartsTable: Table | undefined =
      await queryRunner.getTable('carts');

    /*
     * Check if `carts` table exists
     * */
    if (createdCartsTable) {
      /*
       * Get foreign keys in `carts` table named `fk_carts_user_id_to_users_id`
       * */
      const cartFks: TableForeignKey | undefined =
        createdCartsTable.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_carts_user_id_to_users_id',
        );

      /*
       * Drop foreign key named `fk_carts_user_id_to_users_id` if exist
       * */
      if (cartFks) {
        await queryRunner.dropForeignKey(createdCartsTable, cartFks);
      }

      /*
       * Get index in `carts` table named `idx_carts_id`
       * */
      const cartIndex: TableIndex | undefined = createdCartsTable.indices.find(
        (i: TableIndex): boolean => i.name === 'idx_carts_id',
      );

      /*
       * Drop index named `idx_carts_id` if exist
       * */
      if (cartIndex) {
        await queryRunner.dropIndex(createdCartsTable, cartIndex);
      }

      /*
       * Drop `carts` table if exist
       * */
      await queryRunner.dropTable(createdCartsTable);
    }
  }
}
