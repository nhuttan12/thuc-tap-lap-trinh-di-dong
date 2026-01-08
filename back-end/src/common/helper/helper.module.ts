/**
 * @description Helper module
 * @author Nhut Tan
 * @since 2025-09-17
 * @version 1.0.0
 */
import { Module } from '@nestjs/common';
import { BuildPagingMetaService } from './build-paging-meta.service';
import { StringHelper } from './string-helper';

@Module({
	providers: [BuildPagingMetaService, StringHelper],
	exports: [BuildPagingMetaService, StringHelper],
})
export class HelperModule {}
