/**
 * @description Helper module
 * @author Nhut Tan
 * @since 2025-09-17
 * @version 1.0.0
 */
import { Module } from '@nestjs/common';
import { BuildPagingMetaService } from './build-paging-meta.service';
import { ExtractStringByDelimeter } from './extract-string-by-delimeter';

@Module({
	providers: [BuildPagingMetaService, ExtractStringByDelimeter],
	exports: [BuildPagingMetaService, ExtractStringByDelimeter],
})
export class HelperModule {}
