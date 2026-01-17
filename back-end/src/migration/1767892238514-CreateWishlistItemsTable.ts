/**
 * @description Create wishlist_items table
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

export class CreateWishlistItemsTable1767892238514
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('wishlist_items');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'wishlist_items',
					columns: [
						{
							name: 'id',
							type: 'int',
							isPrimary: true,
							isGenerated: true,
							generationStrategy: 'increment',
						},
						{
							name: 'product_id',
							type: 'int',
							isNullable: false,
						},
						{
							name: 'user_id',
							type: 'int',
							isNullable: false,
						},
						{
							name: 'status',
							type: 'enum',
							enum: ['ACTIVE', 'DELETED'],
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
			await queryRunner.getTable('wishlist_items');
		const hasProductIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_wishlist_items_product_id_to_products_id'
			);
		const hasUserIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_wishlist_items_user_id_to_users_id'
			);

		if (!hasProductIDFk) {
			await queryRunner.createForeignKey(
				'wishlist_items',
				new TableForeignKey({
					name: 'fk_wishlist_items_product_id_to_products_id',
					columnNames: ['product_id'],
					referencedTableName: 'products',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}

		if (!hasUserIDFk) {
			await queryRunner.createForeignKey(
				'wishlist_items',
				new TableForeignKey({
					name: 'fk_wishlist_items_user_id_to_users_id',
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
		const table: Table | undefined =
			await queryRunner.getTable('wishlist_items');

		if (table) {
			const hasProductIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name ===
						'fk_wishlist_items_product_id_to_products_id'
				);
			const hasUserIDFk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name === 'fk_wishlist_items_user_id_to_users_id'
				);

			if (hasProductIDFk) {
				await queryRunner.dropForeignKey(
					'wishlist_items',
					hasProductIDFk
				);
			}

			if (hasUserIDFk) {
				await queryRunner.dropForeignKey('wishlist_items', hasUserIDFk);
			}

			await queryRunner.dropTable('wishlist_items');
		}
	}
}
