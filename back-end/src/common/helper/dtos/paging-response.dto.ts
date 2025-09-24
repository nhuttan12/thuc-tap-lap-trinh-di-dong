/**
 * @description Paging response DTO wrapper
 * @author Nhut Tan
 * @since 2025-09-17
 * @version 1.0.0
 */

import { PagingMetaDto } from './page-meta.dto';

export class PagingResponseDto<T> {
  /**
   * Metadata about pagination
   * */
  meta: PagingMetaDto;

  /**
   * Actual data list
   */
  data: T[];

  constructor(data: T[], meta: PagingMetaDto) {
    this.meta = meta;
    this.data = data;
  }
}
