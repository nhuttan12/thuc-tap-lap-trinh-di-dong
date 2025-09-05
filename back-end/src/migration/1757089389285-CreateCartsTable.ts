import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCartsTable1757089389285 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const cartsTable: Table | undefined = await queryRunner.getTable('carts');

    if (!cartsTable) {
      await queryRunner.createTable(
        new Table({
          name: 'carts',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
              isNullable: false,
            },
            {
              name: 'user_id',
              type: 'integer',
              isNullable: false,
            },
            {
              status: 'enum',
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
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
