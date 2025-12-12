/**
 * @description Brand module
 * @author Nhut Tan
 * @since 2025-12-11
 * @version 1.0.0
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandEntity } from './entities/brand.entiy';
import { BrandRepository } from './repositories/brand.repository';
import { BrandMapper } from './mappers/brand.mapper';
import { BrandService } from './brand.service';

@Module({
	imports: [TypeOrmModule.forFeature([BrandEntity])],
	controllers: [],
	providers: [BrandRepository, BrandMapper],
	exports: [BrandService],
})
export class BrandModule {}
