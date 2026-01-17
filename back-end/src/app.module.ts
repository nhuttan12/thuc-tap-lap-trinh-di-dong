/*
 * @description Main module of application
 * @author Nhut Tan
 * @since 2025-08-30
 * @version 1.0.1
 * @modifies 2025-09-10
 */

import { Logger, Module } from '@nestjs/common';
import {
	ConfigModule as NestConfigModule,
	ConfigService,
} from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from './common/config/config.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { envValidationSchema } from './common/config/validation/validation.schema';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/category/category.module';
import { ImageModule } from './modules/image/image.module';
import { OrderModule } from './modules/orders/order.module';
import { ProductModule } from './modules/product/product.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { AppThrottlerModule } from './common/infrastructure/app-throttler.module';
import { BrandModule } from './modules/brand/brand.module';
import { HelperModule } from './common/helper/helper.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
	imports: [
		NestConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env.local',
			validationSchema: envValidationSchema,
		}),
		DatabaseModule,
		ConfigModule,
		UserModule,
		AuthModule,
		RoleModule,
		CartModule,
		CategoryModule,
		ImageModule,
		OrderModule,
		ProductModule,
		WishlistModule,
		PaymentModule,
		BrandModule,
		HelperModule,
	],
	providers: [Logger, ConfigService],
	exports: [Logger, ConfigService],
})
export class AppModule {}
