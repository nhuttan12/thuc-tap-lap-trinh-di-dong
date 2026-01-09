/**
 * @description Create payments table
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

export class CreatePaymentsTable1767892648322 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined = await queryRunner.getTable('payments');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'payments',
					columns: [
						{
							name: 'id',
							type: 'int',
							isPrimary: true,
							isGenerated: true,
							generationStrategy: 'increment',
						},
						{
							name: 'order_id',
							type: 'int',
							isNullable: false,
						},
						{
							name: 'user_id',
							type: 'int',
							isNullable: false,
						},
						{
							name: 'amount',
							type: 'numeric',
							precision: 2,
							isNullable: false,
						},
						{
							name: 'currency',
							type: 'varchar',
							length: '3',
							isNullable: false,
						},
						{
							name: 'status',
							type: 'enum',
							enum: [
								'PENDING',
								'COMPLETED',
								'FAILED',
								'REFUNDED',
							],
							default: `'PENDING'`,
						},
						{
							name: 'payment_method',
							type: 'enum',
							enum: [
								'CREDIT_CARD',
								'PAYPAL',
								'BANK_TRANSFER',
								'OTHER',
							],
							default: `'CREDIT_CARD'`,
						},
						{
							name: 'transaction_id',
							type: 'varchar',
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
			await queryRunner.getTable('payments');

		const hasOrderIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_payments_order_id_to_orders_id'
			);

		if (!hasOrderIDFk) {
			await queryRunner.createForeignKey(
				'payments',
				new TableForeignKey({
					name: 'fk_payments_order_id_to_orders_id',
					columnNames: ['order_id'],
					referencedTableName: 'orders',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}

		const hasUserIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_payments_user_id_to_users_id'
			);

		if (!hasUserIDFk) {
			await queryRunner.createForeignKey(
				'payments',
				new TableForeignKey({
					name: 'fk_payments_user_id_to_users_id',
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
		const table: Table | undefined = await queryRunner.getTable('payments');

		if (table) {
			const hasOrderIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name === 'fk_payments_order_id_to_orders_id'
				);

			if (hasOrderIDFk) {
				await queryRunner.dropForeignKey('payments', hasOrderIDFk);
			}

			const hasUserIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name === 'fk_payments_user_id_to_users_id'
				);

			if (hasUserIDFk) {
				await queryRunner.dropForeignKey('payments', hasUserIDFk);
			}

			await queryRunner.dropTable('payments');
		}
	}
}
