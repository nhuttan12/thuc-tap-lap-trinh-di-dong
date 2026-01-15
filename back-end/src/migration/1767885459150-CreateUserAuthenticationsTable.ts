/**
 * @description Create user_authentications table
 * @author Nhut Tan
 * @since 2025-01-08
 * @version 1.0.0
 */

import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class CreateUserAuthenticationsTable1767885459150
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined = await queryRunner.getTable(
			'user_authentications'
		);

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'user_authentications',
					columns: [
						{
							name: 'user_id',
							type: 'int',
							isPrimary: true,
							isGenerated: false,
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
							default: 'CURRENT_TIMESTAMP',
						},
						{
							name: 'updated_at',
							type: 'timestamp',
							default: 'CURRENT_TIMESTAMP',
						},
					],
				})
			);
		}

		const currentTable: Table | undefined = await queryRunner.getTable(
			'user_authentications'
		);
		const hasFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk): boolean =>
					fk.name === 'fk_user_authentications_user_id_to_users_id'
			);

		if (!hasFk) {
			await queryRunner.createForeignKey(
				'user_authentications',
				new TableForeignKey({
					name: 'fk_user_authentications_user_id_to_users_id',
					columnNames: ['user_id'],
					referencedTableName: 'users',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined = await queryRunner.getTable(
			'user_authentications'
		);

		if (table) {
			const fk: TableForeignKey | undefined = table.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_user_authentications_user_id_to_users_id'
			);

			if (fk) {
				await queryRunner.dropForeignKey('user_authentications', fk);
			}

			await queryRunner.dropTable('user_authentications');
		}
	}
}
