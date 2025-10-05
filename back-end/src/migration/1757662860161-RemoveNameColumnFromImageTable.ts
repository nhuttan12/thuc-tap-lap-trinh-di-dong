/**
 * @description Migration remove `name` column from `images` table
 * @author Nhut Tan
 * @since 2025/09/07
 * @modifies 2025/09/22
 * @version 1.0.1
 */

import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class RemoveNameColumnFromImageTable1757662860161
	implements MigrationInterface
{
	/**
	 * @description Migration run removing `name` column from `images` table
	 * @author Nhut Tan
	 * @since 2025/09/07
	 * @modifies 2025/09/22
	 * @version 1.0.1
	 */
	public async up(queryRunner: QueryRunner): Promise<void> {
		/*
		 * Get `images` table if exist
		 */
		const imageTable: Table | undefined =
			await queryRunner.getTable('images');

		/*
		 * Check `images` table existence
		 */
		if (!imageTable) return;

		/*
		 * Get `name` columns in `images` table if exist
		 */
		const nameColumn: TableColumn | undefined = imageTable.columns.find(
			(column: TableColumn): boolean => column.name === 'name'
		);

		/*
		 * Check column `name` in `images` table existence
		 */
		if (!nameColumn) return;

		/*
		 * Remove `name` column in `images` table
		 */
		await queryRunner.dropColumn(imageTable, nameColumn);
	}

	/**
	 * @description Migration revert removing `name` column from `images` table
	 * @author Nhut Tan
	 * @since 2025/09/07
	 * @modifies 2025/09/22
	 * @version 1.0.1
	 */
	public async down(queryRunner: QueryRunner): Promise<void> {
		/*
		 * Get `images` table if exist
		 */
		const imageTable: Table | undefined =
			await queryRunner.getTable('images');

		/*
		 * Check `images` table existence
		 */
		if (!imageTable) return;

		/*
		 * Get `name` columns in `images` table if exist
		 */
		const nameColumn: TableColumn | undefined = imageTable.columns.find(
			(column: TableColumn): boolean => column.name === 'name'
		);

		/*
		 * Check column `name` in `images` table existence
		 */
		if (nameColumn) return;

		/*
		 * Create `name` column in `images` table
		 */
		await queryRunner.addColumn(
			imageTable,
			new TableColumn({
				name: 'name',
				type: 'varchar',
				isNullable: false,
			})
		);
	}
}
