/*
 * @description: Migration create `user_images` table
 * @author: Nhut Tan
 * @date: 2025/09/06
 * @version: 1.0.0
 * */

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUserImagesTable1757179904025 implements MigrationInterface {
  /*
   * @description: Migration run creating `user_images` table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `user_images` if exist
     * */
    const userImagesTable: Table | undefined =
      await queryRunner.getTable('user_images');

    /*
     * Check if `user_images` not exist
     * */
    if (!userImagesTable) {
      /*
       * Create new `user_images` table
       * */
      await queryRunner.createTable(
        new Table({
          name: 'user_images',
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
              name: 'image_id',
              type: 'integer',
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
     * Get `user_images` after created
     * */
    const userImagesTableCreated: Table | undefined =
      await queryRunner.getTable('user_images');

    /*
     * Check if `user_images` exist
     * */
    if (userImagesTableCreated) {
      /*
       * Get foreign key named `fk_user_images_image_id_to_images_id`
       * */
      const userIDFk: TableForeignKey | undefined =
        userImagesTableCreated.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_user_images_image_id_to_images_id',
        );

      /*
       * Check if foreign key `fk_user_images_image_id_to_images_id` not exist
       * */
      if (!userIDFk) {
        /*
         * Create foreign key `fk_user_images_image_id_to_images_id` if not exist
         * */
        await queryRunner.createForeignKey(
          userImagesTableCreated,
          new TableForeignKey({
            name: 'fk_user_images_image_id_to_images_id',
            columnNames: ['image_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'images',
          }),
        );
      }

      /*
       * Get foreign key named `fk_user_images_user_id_to_users_id`
       * */
      const imageIDFk: TableForeignKey | undefined =
        userImagesTableCreated.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_user_images_user_id_to_users_id',
        );

      /*
       * Check if foreign key `fk_user_images_user_id_to_users_id` not exist
       * */
      if (!imageIDFk) {
        /*
         * Create foreign key `fk_user_images_user_id_to_users_id` if not exist
         * */
        await queryRunner.createForeignKey(
          userImagesTableCreated,
          new TableForeignKey({
            name: 'fk_user_images_user_id_to_users_id',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
          }),
        );
      }
    }
  }

  /*
   * @description: Migration revert creating `user_images` table
   * @author: Nhut Tan
   * @date: 2025/09/06
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get `user_images` after created
     * */
    const userImagesTableCreated: Table | undefined =
      await queryRunner.getTable('user_images');

    /*
     * Check if `user_images` exist
     * */
    if (userImagesTableCreated) {
      /*
       * Get foreign key named `fk_user_images_image_id_to_images_id`
       * */
      const userIDFk: TableForeignKey | undefined =
        userImagesTableCreated.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_user_images_image_id_to_images_id',
        );

      /*
       * Check if foreign key `fk_user_images_image_id_to_images_id` exist
       * */
      if (userIDFk) {
        /*
         * Drop foreign key `fk_user_images_image_id_to_images_id` if exist
         * */
        await queryRunner.dropForeignKey(userImagesTableCreated, userIDFk);
      }

      /*
       * Get foreign key named `fk_user_images_user_id_to_users_id`
       * */
      const imageIDFk: TableForeignKey | undefined =
        userImagesTableCreated.foreignKeys.find(
          (fk: TableForeignKey): boolean =>
            fk.name === 'fk_user_images_user_id_to_users_id',
        );

      /*
       * Check if foreign key `fk_user_images_user_id_to_users_id` exist
       * */
      if (imageIDFk) {
        /*
         * Drop foreign key `fk_user_images_user_id_to_users_id` if exist
         * */
        await queryRunner.dropForeignKey(userImagesTableCreated, imageIDFk);
      }

      /*
       * Drop `user_images` table if exist
       * */
      await queryRunner.dropTable(userImagesTableCreated);
    }
  }
}
