/**
 * @description Category module
 * @module CategoryModule
 * @author Nhut Tan
 * @since 2025-09-14
 * @modifies 2025-10-05
 * @modifies 2026-01-01
 * @version 1.0.2
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repositories/category.repository';

@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity])],
	providers: [CategoryService, CategoryRepository],
	exports: [CategoryService],
})
export class CategoryModule {}
