/**
 * @description Migration create `brands` table
 * @author Nhut Tan
 * @since 2025-12-11
 * @version 1.0.0
 */
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { BrandStatusEnum } from '../modules/brand/enums/brand-status.enum';

export class CreateBrandsTable1765432588422 implements MigrationInterface {
	/**
	 * @description Migration run create `brands` table
	 */
	public async up(queryRunner: QueryRunner): Promise<void> {
		/**
		 * Get `brands` table
		 */
		const brandsTable: Table | undefined =
			await queryRunner.getTable('brands');

		/**
		 * Check `brands` table existence, if exist, then return
		 */
		if (brandsTable) return;

		/**
		 * Create `brands` table if not exist
		 */
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
						name: 'name',
						type: 'varchar',
					},
					{
						name: 'image_id',
						type: 'integer',
						isNullable: false,
					},
					{
						name: 'status',
						type: 'enum',
						enum: Object.values(BrandStatusEnum),
						default: `'${BrandStatusEnum.ACTIVE}'`,
						isNullable: false,
					},
					{
						name: 'created_at',
						type: 'timestamp',
						isNullable: false,
						default: 'CURRENT_TIMESTAMP',
					},
					{
						name: 'updated_at',
						type: 'timestamp',
						isNullable: false,
						default: 'CURRENT_TIMESTAMP',
					},
				],
			})
		);
	}

	/**
	 * @description Migration revert remove `brands` table
	 */
	public async down(queryRunner: QueryRunner): Promise<void> {
		/**
		 * Get `brands` table
		 */
		const brandsTable: Table | undefined =
			await queryRunner.getTable('brands');

		/**
		 * Check `brands` table existence, if not exist, then return
		 */
		if (!brandsTable) return;

		const imageIDColumn: TableColumn | undefined = brandsTable.columns.find(
			(column: TableColumn): boolean => column.name === 'image_id'
		);

		if (!imageIDColumn) {
			await queryRunner.addColumn(
				'brands',
				new TableColumn({
					name: 'image_id',
					type: 'integer',
					isNullable: false,
				})
			);
		}

		/**
		 * Drop `brands` table if exist
		 */
		await queryRunner.dropTable(brandsTable);
	}
}
