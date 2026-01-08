/**
 * @description Create user_images table
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

export class CreateUserImagesTable1767885483734 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('user_images');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'user_images',
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
							name: 'image_id',
							type: 'int',
							isNullable: false,
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
			await queryRunner.getTable('user_images');
		const hasUserIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk): boolean =>
					fk.name === 'fk_user_authentications_user_id_to_users_id'
			);
		const hasImageIDFk: TableForeignKey | undefined =
			currentTable?.foreignKeys.find(
				(fk): boolean =>
					fk.name === 'fk_user_authentications_image_id_to_images_id'
			);

		if (!hasUserIDFk) {
			await queryRunner.createForeignKey(
				'user_images',
				new TableForeignKey({
					name: 'fk_user_authentications_user_id_to_users_id',
					columnNames: ['user_id'],
					referencedTableName: 'users',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}

		if (!hasImageIDFk) {
			await queryRunner.createForeignKey(
				'user_images',
				new TableForeignKey({
					name: 'fk_user_authentications_image_id_to_images_id',
					columnNames: ['image_id'],
					referencedTableName: 'images',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('user_images');

		if (table) {
			const userIDfk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name ===
						'fk_user_authentications_user_id_to_users_id'
				);
			const imageIDfk: TableForeignKey | undefined =
				table.foreignKeys.find(
					(fk: TableForeignKey): boolean =>
						fk.name ===
						'fk_user_authentications_image_id_to_images_id'
				);

			if (userIDfk) {
				await queryRunner.dropForeignKey(
					'user_authentications',
					userIDfk
				);
			}

			if (imageIDfk) {
				await queryRunner.dropForeignKey(
					'user_authentications',
					imageIDfk
				);
			}

			await queryRunner.dropTable('user_authentications');
		}
	}
}
