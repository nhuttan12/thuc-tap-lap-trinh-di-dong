/**
 * @description Create cart_details table
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

export class CreateCartDetailsTable1767892621310 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('cart_details');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'cart_details',
					columns: [
						{
							name: 'id',
							type: 'int',
							isPrimary: true,
							isGenerated: true,
							generationStrategy: 'increment',
						},
						{
							name: 'cart_id',
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
			await queryRunner.getTable('cart_details');

		const hasCartIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_cart_details_cart_id_to_carts_id'
			);

		if (!hasCartIDFk) {
			await queryRunner.createForeignKey(
				'cart_details',
				new TableForeignKey({
					name: 'fk_cart_details_cart_id_to_carts_id',
					columnNames: ['cart_id'],
					referencedTableName: 'carts',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}

		const hasProductIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_cart_details_product_id_to_products_id'
			);

		if (!hasProductIDFk) {
			await queryRunner.createForeignKey(
				'cart_details',
				new TableForeignKey({
					name: 'fk_cart_details_product_id_to_products_id',
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
			await queryRunner.getTable('cart_details');

		if (table) {
			const hasCartIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name === 'fk_cart_details_cart_id_to_carts_id'
				);

			if (hasCartIDFk) {
				await queryRunner.dropForeignKey('cart_details', hasCartIDFk);
			}

			const hasProductIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name === 'fk_cart_details_product_id_to_products_id'
				);

			if (hasProductIDFk) {
				await queryRunner.dropForeignKey(
					'cart_details',
					hasProductIDFk
				);
			}

			await queryRunner.dropTable('cart_details');
		}
	}
}
