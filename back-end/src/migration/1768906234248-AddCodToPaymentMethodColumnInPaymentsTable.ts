/**
 * @description Add cod to payment_method column in payments table
 * @author Nhut Tan
 * @since 2026-01-20
 * @version 1.0.0
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCodToPaymentMethodColumnInPaymentsTable1768906234248
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TYPE "payments_payment_method_enum" ADD VALUE IF NOT EXISTS 'COD'`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`UPDATE "payments" SET "payment_method" = 'OTHER' WHERE "payment_method" = 'COD'`
		);
	}
}
