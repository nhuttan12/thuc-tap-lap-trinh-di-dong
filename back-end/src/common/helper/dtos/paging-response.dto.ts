/**
 * @description: Paging response DTO wrapper
 * @author: Nhut Tan
 * @date: 2025-09-17
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
