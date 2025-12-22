/**
 * @description Migration file for adding reset token and reset token
 * expiration to users table
 * @author Vo Tan Tai
 * @since 2025/11/18
 * @version 1.0.0
 */

import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddResetTokenAndResetTokenExpiration1763478764704
	implements MigrationInterface
{
	/**
	 * @description Migration run adding reset_token and
	 * 	reset_token_expiration to users table
	 * @author Vo Tan Tai
	 * @since 2025/11/18
	 * @version 1.0.0
	 */
	public async up(queryRunner: QueryRunner): Promise<void> {
		/*
		 * Check if users table exists
		 */
		const usersTable: Table | undefined =
			await queryRunner.getTable('users');

		/**
		 * Check if `users` not table exist, skip migration
		 */
		if (!usersTable) return;

		/**
		 * Get `reset_token` columns of `users` table if exist
		 */
		const resetTokenColumn: TableColumn | undefined =
			usersTable.columns.find(
				(column: TableColumn): boolean => column.name === 'reset_token'
			);

		/**
		 * if `reset_token` column not exist, create new one
		 */
		if (!resetTokenColumn) {
			await queryRunner.addColumn(
				usersTable,
				new TableColumn({
					name: 'reset_token',
					type: 'text',
					isNullable: true,
				})
			);
		}

		/**
		 * Get `reset_token_expiration` columns of `users` table if exist
		 */
		const resetTokenExpirationColumn: TableColumn | undefined =
			usersTable.columns.find(
				(column: TableColumn): boolean =>
					column.name === 'reset_token_expiration'
			);

		/**
		 * if `reset_token_expiration` column not exist, create new one
		 */
		if (!resetTokenExpirationColumn) {
			await queryRunner.addColumn(
				usersTable,
				new TableColumn({
					name: 'reset_token_expiration',
					type: 'bigint',
					isNullable: true,
				})
			);
		}
	}

	/**
	 * @description Migration revert removing reset_token and
	 * 	reset_token_expiration from users table
	 * @author Vo Tan Tai
	 * @since 2025/11/18
	 * @version 1.0.0
	 */
	public async down(queryRunner: QueryRunner): Promise<void> {
		/*
		 * Check if users table exists
		 */
		const usersTable: Table | undefined =
			await queryRunner.getTable('users');

		/**
		 * Check whether `users` table not exist, skip migration
		 */
		if (!usersTable) return;

		/**
		 * Get `reset_token` columns of `users` table if exist
		 */
		const resetTokenColumn: TableColumn | undefined =
			usersTable.columns.find(
				(column: TableColumn): boolean => column.name === 'reset_token'
			);

		/**
		 * if `reset_token` column exist, drop it
		 */
		if (resetTokenColumn) {
			await queryRunner.dropColumn(usersTable, resetTokenColumn);
		}

		/**
		 * Get `reset_token_expiration` columns of `users` table if exist
		 */
		const resetTokenExpirationColumn: TableColumn | undefined =
			usersTable.columns.find(
				(column: TableColumn): boolean =>
					column.name === 'reset_token_expiration'
			);

		/**
		 * if `reset_token_expiration` column exist, drop it
		 */
		if (resetTokenExpirationColumn) {
			await queryRunner.dropColumn(
				usersTable,
				resetTokenExpirationColumn
			);
		}
	}
}
