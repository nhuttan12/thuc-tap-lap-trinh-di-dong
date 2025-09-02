import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateUserTable1756830133605 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            isNullable: false,
          },
          {
            name: 'username',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'full_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'role_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: Date.now(),
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: Date.now(),
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'fk_user_role_id_to_roles_id',
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
      }),
    );

    await queryRunner.createIndices('users', [
      new TableIndex({
        name: 'idx_user_id',
        columnNames: ['id'],
      }),
      new TableIndex({
        name: 'idx_user_username',
        columnNames: ['username'],
      }),
      new TableIndex({
        name: 'idx_user_password',
        columnNames: ['password'],
      }),
      new TableIndex({
        name: 'idx_user_email',
        columnNames: ['email'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'idx_user');
    await queryRunner.dropForeignKey('users', 'fk_user_role_id_to_roles_id');
    await queryRunner.dropTable('users');
  }
}
