/**
 * @description: Helper module
 * @author: Nhut Tan
 * @date: 2025-09-17
 * @version: 1.0.0
 */
import { Module } from '@nestjs/common';
import { BuildPagingMetaService } from './build-paging-meta.service';

@Module({
  providers: [BuildPagingMetaService],
  exports: [BuildPagingMetaService],
})
export class HelperModule {}
