/**
 * @description Create brands table
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

export class CreateBrandsTable1767882774159 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined = await queryRunner.getTable('brands');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'brands',
					columns: [
						{
							name: 'id',
							type: 'int',
							isPrimary: true,
							isGenerated: true,
							generationStrategy: 'increment',
						},
						{
							name: 'image_id',
							type: 'int',
							isNullable: false,
						},
						{
							name: 'name',
							type: 'varchar',
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

		const hasImagesTable: boolean = await queryRunner.hasTable('images');
		if (hasImagesTable) {
			await queryRunner.createForeignKey(
				'brands',
				new TableForeignKey({
					name: 'fk_brands_image_id_images_id',
					columnNames: ['image_id'],
					referencedTableName: 'images',
					referencedColumnNames: ['id'],
					onDelete: 'SET NULL',
					onUpdate: 'CASCADE',
				})
			);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined = await queryRunner.getTable('brands');
		if (table) {
			const fk: TableForeignKey | undefined = table.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_brands_image_id_images_id'
			);
			if (fk) {
				await queryRunner.dropForeignKey('brands', fk);
			}
		}

		await queryRunner.dropTable('brands');
	}
}
