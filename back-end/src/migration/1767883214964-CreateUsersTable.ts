/**
 * @description Create users table
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

export class CreateUsersTable1767883214964 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined = await queryRunner.getTable('users');

		if (!table) {
			await queryRunner.createTable(
				new Table({
					name: 'users',
					columns: [
						{
							name: 'id',
							type: 'int',
							isPrimary: true,
							isGenerated: true,
							generationStrategy: 'increment',
						},
						{
							name: 'username',
							type: 'varchar',
							isNullable: false,
						},
						{
							name: 'password',
							type: 'text',
							isNullable: false,
						},
						{
							name: 'full_name',
							type: 'varchar',
							isNullable: true,
						},
						{
							name: 'email',
							type: 'text',
							isNullable: false,
						},
						{
							name: 'status',
							type: 'enum',
							enum: ['ACTIVE', 'INACTIVE', 'DELETED', 'BANNED'],
							default: `'ACTIVE'`,
						},
						{
							name: 'role_id',
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

		const hasRoleTable: boolean = await queryRunner.hasTable('roles');
		if (hasRoleTable) {
			await queryRunner.createForeignKey(
				'users',
				new TableForeignKey({
					name: 'fk_users_role_id_roles_id',
					columnNames: ['role_id'],
					referencedTableName: 'roles',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				})
			);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table: Table | undefined =
			await queryRunner.getTable('users');

		if (table) {
			const fk: TableForeignKey | undefined = table.foreignKeys.find(
				(fk: TableForeignKey): boolean =>
					fk.name === 'fk_users_role_id_roles_id'
			);

			if (fk) {
				await queryRunner.dropForeignKey('users', fk);
			}

			await queryRunner.dropTable('users');
		}
	}
}
