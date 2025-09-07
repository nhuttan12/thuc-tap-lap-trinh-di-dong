/*
 * @description: Migration updating id field for roles, users, images,
 * categories, products, product_details, user_details table
 * @author: Nhut Tan
 * @date: 2025/09/06
 * @version: 1.0.0
 * */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class ModifyIdFieldForTable1757154043115 implements MigrationInterface {
  /*
   * @description: Migration run updating id field for roles, users, images,
   * categories, products, product_details, user_details table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Update `roles` table
     * */
    await this.addingGenerationStrategyIDTableMigrationUp(queryRunner, 'roles');

    /*
     * Update `users` table
     * */
    await this.addingGenerationStrategyIDTableMigrationUp(queryRunner, 'users');

    /*
     * Update `images` table
     * */
    await this.addingGenerationStrategyIDTableMigrationUp(
      queryRunner,
      'images',
    );

    /*
     * Update `categories` table
     * */
    await this.addingGenerationStrategyIDTableMigrationUp(
      queryRunner,
      'categories',
    );

    /*
     * Update `products` table
     * */
    await this.addingGenerationStrategyIDTableMigrationUp(
      queryRunner,
      'products',
    );

    /*
     * Update `user_details` table
     * */
    await this.removeIsGeneratedIDTableMigrationUp(queryRunner, 'user_details');

    /*
     * Update `user_details` table
     * */
    await this.removeIsGeneratedIDTableMigrationUp(
      queryRunner,
      'product_details',
    );
  }

  /*
   * @description: Migration revert updating id field for roles, users, images,
   * categories, products, product_details, user_details table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Update `roles` table
     * */
    await this.removingGenerationStrategyIDTableMigrationDown(
      queryRunner,
      'roles',
    );

    /*
     * Update `users` table
     * */
    await this.removingGenerationStrategyIDTableMigrationDown(
      queryRunner,
      'users',
    );

    /*
     * Update `images` table
     * */
    await this.removingGenerationStrategyIDTableMigrationDown(
      queryRunner,
      'images',
    );

    /*
     * Update `categories` table
     * */
    await this.removingGenerationStrategyIDTableMigrationDown(
      queryRunner,
      'categories',
    );

    /*
     * Update `products` table
     * */
    await this.removingGenerationStrategyIDTableMigrationDown(
      queryRunner,
      'products',
    );

    /*
     * Update `user_details` table
     * */
    await this.addingIsGeneratedIDTableMigrationDown(
      queryRunner,
      'user_details',
    );

    /*
     * Update `product_details` table
     * */
    await this.addingIsGeneratedIDTableMigrationDown(
      queryRunner,
      'product_details',
    );
  }

  private async addingGenerationStrategyIDTableMigrationUp(
    queryRunner: QueryRunner,
    tableName: string,
  ): Promise<void> {
    /*
     * Get table if exists
     * */
    const existingTable: Table | undefined =
      await queryRunner.getTable(tableName);

    /*
     * Check if table exists
     * */
    if (existingTable) {
      /*
       * Drop foreign keys of table
       * */
      const droppedFKs = await this.dropForeignKeysReferencingTable(
        queryRunner,
        tableName,
      );

      /*
       * Update table adding `generationStrategy` to `id` column
       * */
      await queryRunner.changeColumn(
        existingTable,
        'id',
        new TableColumn({
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
          isNullable: false,
        }),
      );

      /*
       * Restore foreign keys of table
       * */
      await this.restoreForeignKeys(queryRunner, droppedFKs);
    }
  }

  private async removeIsGeneratedIDTableMigrationUp(
    queryRunner: QueryRunner,
    tableName: string,
  ): Promise<void> {
    /*
     * Get table if exists
     * */
    const existingTable: Table | undefined =
      await queryRunner.getTable(tableName);

    /*
     * Check if `user_details` table exists
     * */
    if (!existingTable) return;

    /*
     * Drop primary key of table if exist
     * */
    if (existingTable.primaryColumns.length) {
      await queryRunner.dropPrimaryKey(existingTable);
    }

    /*
     * Drop foreign keys of table preference this table
     * */
    const droppedFKs = await this.dropForeignKeysReferencingTable(
      queryRunner,
      tableName,
    );

    /*
     * Update `user_details` table adding `generationStrategy` to `id` column
     * */
    await queryRunner.changeColumn(
      existingTable,
      'id',
      new TableColumn({
        name: 'id',
        type: 'int',
        isPrimary: true,
        isNullable: false,
      }),
    );

    /*
     * Restore foreign keys of table
     * */
    await this.restoreForeignKeys(queryRunner, droppedFKs);
  }

  private async removingGenerationStrategyIDTableMigrationDown(
    queryRunner: QueryRunner,
    tableName: string,
  ): Promise<void> {
    /*
     * Get table if exists
     * */
    const existingTable: Table | undefined =
      await queryRunner.getTable(tableName);

    /*
     * Check if table exists
     * */
    if (!existingTable) return;

    /*
     * Drop foreign keys of table preference this table
     *  */
    const droppedFKs = await this.dropForeignKeysReferencingTable(
      queryRunner,
      tableName,
    );

    /*
     * Drop primary key of table if exist
     * */
    if (existingTable.primaryColumns.length) {
      await queryRunner.dropPrimaryKey(existingTable);
    }

    /*
     * Update table removing `generationStrategy` in `id` column
     * */
    await queryRunner.changeColumn(
      existingTable,
      'id',
      new TableColumn({
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        isNullable: false,
      }),
    );

    /*
     * Restore foreign keys
     * */
    await this.restoreForeignKeys(queryRunner, droppedFKs);
  }

  private async addingIsGeneratedIDTableMigrationDown(
    queryRunner: QueryRunner,
    tableName: string,
  ): Promise<void> {
    /*
     * Get table if exists
     * */
    const existingTable: Table | undefined =
      await queryRunner.getTable(tableName);

    /*
     * Check if `user_details` table exists
     * */
    if (!existingTable) return;

    /*
     * Drop foreign keys of table preference this table
     *  */
    const droppedFKs = await this.dropForeignKeysReferencingTable(
      queryRunner,
      tableName,
    );

    /*
     * Drop primary key of table if exist
     * */
    if (existingTable.primaryColumns.length) {
      await queryRunner.dropPrimaryKey(existingTable);
    }

    /*
     * Update `user_details` table adding `generationStrategy` to `id` column
     * */
    await queryRunner.changeColumn(
      existingTable,
      'id',
      new TableColumn({
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        isNullable: false,
      }),
    );

    /*
     * Restore foreign keys of table
     * */
    await this.restoreForeignKeys(queryRunner, droppedFKs);
  }

  private async dropForeignKeysReferencingTable(
    queryRunner: QueryRunner,
    referencedTable: string,
  ): Promise<{ table: Table; fk: TableForeignKey }[]> {
    /*
     * Get all tables
     * */
    const tables: Table[] = await queryRunner.getTables();

    const droppedFKs: { table: Table; fk: TableForeignKey }[] = [];

    /*
     * Drop fks of table
     * */
    for (const table of tables) {
      for (const fk of table.foreignKeys) {
        if (fk.referencedTableName === referencedTable) {
          await queryRunner.dropForeignKey(table, fk);
          droppedFKs.push({ table, fk });
        }
      }
    }
    return droppedFKs;
  }

  private async restoreForeignKeys(
    queryRunner: QueryRunner,
    fks: { table: Table; fk: TableForeignKey }[],
  ): Promise<void> {
    for (const { table, fk } of fks) {
      await queryRunner.createForeignKey(table, fk);
    }
  }
}
