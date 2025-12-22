/**
 * @description Migration file for create `user_authentications` table
 * @author Vo Tan Tai
 * @since 2025/12/19
 * @version 1.0.0
 */

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddResetOtpAndResetOtpExpiration1766133212871 implements MigrationInterface {

    /**
     * @description Migration run creating `user_authentications` table
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
         * Check if `user_authentications` table exist, then return
         */
        if (userAuthensTable) return;

        /**
         * Create `user_authentications` table
         */
        await queryRunner.createTable(new Table({
            name: 'user_authentications',
            columns: [
                {
                    name: 'user_id',
                    type: 'integer',
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: 'reset_token',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'reset_token_expiration',
                    type: 'bigint',
                    isNullable: true,
                },
                {
                    name: 'reset_otp',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'reset_otp_expiration',
                    type: 'bigint',
                    isNullable: true,
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
            ]
        }));
    }

    /**
     * @description Migration revert drop `user_authentications` table
     * @author Vo Tan Tai
     * @since 2025/12/19
     * @version 1.0.0
     */
    public async down(queryRunner: QueryRunner): Promise<void> {
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
         * Drop `user_authentications` table
         */
        await queryRunner.dropTable(userAuthensTable);
    }
}
