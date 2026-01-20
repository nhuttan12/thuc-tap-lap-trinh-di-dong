import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePaymentAmount1768929010802 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
		  ALTER TABLE "payments"
		  ALTER COLUMN "amount"
		  TYPE NUMERIC(12,2)
		  USING "amount"::NUMERIC(12,2);
		`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
		  ALTER TABLE "payments"
		  ALTER COLUMN "amount"
		  TYPE NUMERIC(2,0)
		  USING "amount"::NUMERIC(2,0);
		`);
    }

}
