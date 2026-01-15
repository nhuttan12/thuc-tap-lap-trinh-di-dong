/**
 * @description Create user_details table
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

export class CreateUserDetailsTable1767883909056 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('user_details');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'user_details',
					columns: [
						{
							name: 'id',
							type: 'int',
							isPrimary: true,
							isGenerated: false,
						},
						{
							name: 'address_1',
							type: 'text',
							isNullable: true,
						},
						{
							name: 'address_2',
							type: 'text',
							isNullable: true,
						},
						{
							name: 'address_3',
							type: 'text',
							isNullable: true,
						},
						{
							name: 'phone_number',
							type: 'varchar',
							length: '10',
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

		const currentTable: Table | undefined =
			await queryRunner.getTable('user_details');
		const hasFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk): boolean => fk.name === 'fk_user_details_id_to_users_id'
			);

		if (!hasFk) {
			await queryRunner.createForeignKey(
				'user_details',
				new TableForeignKey({
					name: 'fk_user_details_id_to_users_id',
					columnNames: ['id'],
					referencedTableName: 'users',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('user_details');

		if (table) {
			const fk: TableForeignKey | undefined = table.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_user_details_id_to_users_id'
			);

			if (fk) {
				await queryRunner.dropForeignKey('user_details', fk);
			}

			await queryRunner.dropTable('user_details');
		}
	}
}
