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
import { BrandController } from './brand.controller';

@Module({
	imports: [TypeOrmModule.forFeature([BrandEntity])],
	controllers: [BrandController],
	providers: [BrandRepository, BrandMapper, BrandService],
	exports: [BrandService],
})
export class BrandModule {}
