/**
 * @description Create orders table
 * @author Nhut Tan
 * @since 2025-01-09
 * @version 1.0.0
 */

import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class CreateOrdersTable1767892631606 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined = await queryRunner.getTable('orders');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'orders',
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
							name: 'price',
							type: 'numeric',
							isNullable: false,
							default: 0,
						},
						{
							name: 'status',
							type: 'enum',
							enum: [
								'PENDING',
								'CONFIRMED',
								'PROCESSING',
								'COMPLETED',
								'CANCELED',
								'ON_HOLD',
							],
							default: `'PENDING'`,
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
			await queryRunner.getTable('orders');

		const hasUserIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_orders_user_id_to_users_id'
			);

		if (!hasUserIDFk) {
			await queryRunner.createForeignKey(
				'orders',
				new TableForeignKey({
					name: 'fk_orders_user_id_to_users_id',
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
		const table: Table | undefined = await queryRunner.getTable('orders');

		if (table) {
			const hasUserIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name === 'fk_orders_user_id_to_users_id'
				);

			if (hasUserIDFk) {
				await queryRunner.dropForeignKey('orders', hasUserIDFk);
			}

			await queryRunner.dropTable('orders');
		}
	}
}
