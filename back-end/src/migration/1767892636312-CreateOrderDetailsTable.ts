/**
 * @description Create order_details table
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

export class CreateOrderDetailsTable1767892636312
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('order_details');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'order_details',
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
							name: 'product_id',
							type: 'int',
							isNullable: false,
						},
						{
							name: 'quantity',
							type: 'int',
							isNullable: false,
							default: 1,
						},
						{
							name: 'price',
							type: 'numeric',
							isNullable: false,
							default: 0,
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
			await queryRunner.getTable('order_details');

		const hasOrderIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_order_details_order_id_to_orders_id'
			);

		if (!hasOrderIDFk) {
			await queryRunner.createForeignKey(
				'order_details',
				new TableForeignKey({
					name: 'fk_order_details_order_id_to_orders_id',
					columnNames: ['order_id'],
					referencedTableName: 'orders',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}

		const hasProductIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_order_details_product_id_to_products_id'
			);

		if (!hasProductIDFk) {
			await queryRunner.createForeignKey(
				'order_details',
				new TableForeignKey({
					name: 'fk_order_details_product_id_to_products_id',
					columnNames: ['product_id'],
					referencedTableName: 'products',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('order_details');

		if (table) {
			const hasOrderIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name === 'fk_order_details_order_id_to_orders_id'
				);

			if (hasOrderIDFk) {
				await queryRunner.dropForeignKey('order_details', hasOrderIDFk);
			}

			const hasProductIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name === 'fk_order_details_product_id_to_products_id'
				);

			if (hasProductIDFk) {
				await queryRunner.dropForeignKey(
					'order_details',
					hasProductIDFk
				);
			}

			await queryRunner.dropTable('order_details');
		}
	}
}
