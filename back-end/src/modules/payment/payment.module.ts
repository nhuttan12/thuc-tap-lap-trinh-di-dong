/**
 * @description Payment module
 * @author Vo Tan Tai
 * @since 2026-01-03
 * @version 1.0.0
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entites/payment.entity';

@Module({
	imports: [TypeOrmModule.forFeature([PaymentEntity])],
	exports: [],
	providers: [],
	controllers: [],
})
export class PaymentModule {}
