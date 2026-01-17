/**
 * @description Create carts table
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

export class CreateCartsTable1767892612331 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined = await queryRunner.getTable('carts');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'carts',
					columns: [
						{
							name: 'id',
							type: 'int',
							isPrimary: true,
							isGenerated: true,
							generationStrategy: 'increment',
						},
						{
							name: 'user_id',
							type: 'int',
							isNullable: false,
						},
						{
							name: 'status',
							type: 'enum',
							enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
							default: `'ACTIVE'`,
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
			await queryRunner.getTable('carts');

		const hasUserIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_carts_user_id_to_users_id'
			);

		if (!hasUserIDFk) {
			await queryRunner.createForeignKey(
				'carts',
				new TableForeignKey({
					name: 'fk_carts_user_id_to_users_id',
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
		const table: Table | undefined = await queryRunner.getTable('carts');

		if (table) {
			const hasUserIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name === 'fk_carts_user_id_to_users_id'
				);

			if (hasUserIDFk) {
				await queryRunner.dropForeignKey('carts', hasUserIDFk);
			}

			await queryRunner.dropTable('carts');
		}
	}
}
