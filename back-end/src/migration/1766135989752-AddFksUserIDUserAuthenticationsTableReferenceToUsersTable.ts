/**
 * @description Migration file for adding fk in `user_id` column in `user_authentications`
 * table to `id` column in `users` table
 * @author Vo Tan Tai
 * @since 2025/12/19
 * @version 1.0.0
 */

import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class AddFksUserIDUserAuthenticationsTableReferenceToUsersTable1766135989752 implements MigrationInterface {

    /**
     * @description Migration run adding fk in `user_id` column in `user_authentications`
     * table to `id` column in `users` table
     * @author Vo Tan Tai
     * @since 2025/12/19
     * @version 1.0.0
     */
    public async up(queryRunner: QueryRunner): Promise<void> {
        /**
         * Check if `user_authentications` table exists
         */
        const userAuthensTable: Table | undefined =
            await queryRunner.getTable('user_authentications');

        /**
         * Check if `user_authentications` table not exist, then return
         */
        if (!userAuthensTable) return;

        /**
		 * Get foreign keys of `user_authentications` table in `user_id` column preference
		 * to `id` column in `users` table
		 */
        const foreignKey: TableForeignKey | undefined = userAuthensTable.foreignKeys.find(
            (fk: TableForeignKey): boolean => {
                return (
                    fk.referencedTableName === 'users' &&
                    fk.columnNames.includes('user_id') &&
                    fk.referencedColumnNames.includes('id')
                );
            }
        );

        /**
         * Check if foreign key exists
         */
        if (foreignKey) return;

        /**
         * Create foreign key named `fk_user_authentications_user_id_to_users_id`
         */
        await queryRunner.createForeignKey(
            userAuthensTable,
            new TableForeignKey({
                name: 'fk_user_authentications_user_id_to_users_id',
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            })
        );
    }

    /**
     * @description Migration revert remove fk in `user_id` column in `user_authentications`
     * table to `id` column in `users` table
     * @author Vo Tan Tai
     * @since 2025/12/19
     * @version 1.0.0
     */
    public async down(queryRunner: QueryRunner): Promise<void> {
        /**
         * Get if `user_authentications` table exists
         */
        const userAuthensTable: Table | undefined =
            await queryRunner.getTable('user_authentications');

        /**
         * Check if `user_authentications` table not exist, then return
         */
        if (!userAuthensTable) return;

        /**
		 * Get foreign keys of `user_authentications` table in `user_id` column preference
		 * to `id` column in `users` table
		 */
        const foreignKey: TableForeignKey | undefined = userAuthensTable.foreignKeys.find(
            (fk: TableForeignKey): boolean => {
                return (
                    fk.referencedTableName === 'user_authentications' &&
                    fk.columnNames.includes('user_id') &&
                    fk.referencedColumnNames.includes('id')
                );
            }
        );

        /**
         * Check if foreign key not exists, then return
         */
        if (!foreignKey) return;

        /**
         * Drop foreign key named `fk_user_authentications_user_id_to_users_id`
         */
        await queryRunner.dropForeignKey(
            userAuthensTable,
            foreignKey
        );
    }

}
