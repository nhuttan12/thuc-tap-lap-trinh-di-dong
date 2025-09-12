/*
 * @description: Migration to add status column to users and roles table
 * @author: Nhut Tan
 * @date: 2025/09/05
 * @version: 1.0.0
 * */

import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { UserStatus } from '../modules/user/enums/user-status.enum';
import { RoleStatus } from '../modules/role/enums/role-status.enum';

export class AddingStatusToUsersAndRolesTable1757059294386
  implements MigrationInterface
{
  /*
   * @description: Run migration
   * @author: Nhut Tan
   * @date: 2025/09/05
   * @version: 1.0.0
   * */
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get users table and roles table if exists
     * */
    const usersTable: Table | undefined = await queryRunner.getTable('users');
    const rolesTable: Table | undefined = await queryRunner.getTable('roles');

    /*
     * Check if table is exist
     * */
    if (usersTable && rolesTable) {
      /*
       * Check tables if has column statusA
       * */
      const usersTableColumn: TableColumn | undefined = usersTable.columns.find(
        (c: TableColumn): boolean => c.name === 'status',
      );
      const rolesTableColumn: TableColumn | undefined = rolesTable.columns.find(
        (c: TableColumn): boolean => c.name === 'status',
      );

      /*
       * Add column status to users table if not exists
       * */
      if (!usersTableColumn) {
        await queryRunner.addColumn(
          usersTable,
          new TableColumn({
            name: 'status',
            type: 'enum',
            enumName: 'user_status',
            enum: Object.values(UserStatus),
            default: `'${UserStatus.ACTIVE}'`,
            isNullable: false,
          }),
        );
      }

      /*
       * Add column status to users table if not exists
       * */
      if (!rolesTableColumn) {
        await queryRunner.addColumn(
          rolesTable,
          new TableColumn({
            name: 'status',
            type: 'enum',
            enumName: 'role_status',
            enum: Object.values(RoleStatus),
            default: `'${RoleStatus.ACTIVE}'`,
            isNullable: false,
          }),
        );
      }
    }
  }

  /*
   * @description: Revert migration
   * @author: Nhut Tan
   * @date: 2025/09/05
   * @version: 1.0.0
   * */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /*
     * Get users table and roles table if exists
     * */
    const usersTable: Table | undefined = await queryRunner.getTable('users');
    const rolesTable: Table | undefined = await queryRunner.getTable('roles');

    /*
     * If users table and roles table is exist
     * */
    if (usersTable && rolesTable) {
      /*
       * Check tables if has column statusA
       * */
      const usersTableColumn: TableColumn | undefined = usersTable.columns.find(
        (c: TableColumn): boolean => c.name === 'status',
      );
      const rolesTableColumn: TableColumn | undefined = rolesTable.columns.find(
        (c: TableColumn): boolean => c.name === 'status',
      );

      /*
       * Drop status column if its exist
       * */
      if (usersTableColumn && rolesTableColumn) {
        await queryRunner.dropColumn(usersTable, 'status');
        await queryRunner.dropColumn(rolesTable, 'status');
      }
    }
  }
}
