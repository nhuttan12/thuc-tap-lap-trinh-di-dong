import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateUserDetailTable1756833480890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_details',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            isNullable: false,
          },
          {
            name: 'address_1',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'address_2',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'address_3',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'user_details',
      new TableForeignKey({
        name: 'fk_user_details_id_to_users_id',
        columnNames: ['id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    );

    await queryRunner.createIndex(
      'user_details',
      new TableIndex({
        name: 'idx_user_details_id',
        columnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'user_details',
      'fk_user_details_id_to_users_id',
    );
    await queryRunner.dropForeignKey(
      'user_details',
      'fk_user_details_id_users_id',
    );
    await queryRunner.dropTable('user_details');
  }
}
