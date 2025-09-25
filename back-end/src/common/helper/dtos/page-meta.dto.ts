/**
 * @description Paging meta data DTO
 * @author Nhut Tan
 * @since 2025-09-17
 */

export class PagingMetaDto {
  /**
   * current page number (1-based)
   */
  page: number;

  /**
   * number of items per page
   */
  limit: number;

  /**
   * total number of items
   */
  totalItems: number;

  /**
   * total number of pages
   */
  totalPages: number;

  /**
   * is there a next page?
   */
  hasNextPage: boolean;

  /**
   * is there a previous page?
   */
  hasPreviousPage: boolean;

  constructor(page: number, limit: number, totalItems: number) {
    this.page = page;
    this.limit = limit;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(totalItems / limit) || 1;
    this.hasNextPage = page < this.totalPages;
    this.hasPreviousPage = page > 1;
  }
}
