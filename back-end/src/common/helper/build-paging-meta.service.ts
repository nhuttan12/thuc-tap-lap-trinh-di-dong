/**
 * @description Build paging meta service
 * @author Nhut Tan
 * @since 2025-09-17
 * @version 1.0.0
 */
import { Injectable } from '@nestjs/common'
import { PagingResponseDto } from './dtos/paging-response.dto'
import { PagingMetaDto } from './dtos/page-meta.dto'

@Injectable()
export class BuildPagingMetaService {
	/**
	 * @description build Pagination response for paging
	 * @param {T[]} items - array of items to be paginated
	 * @param {number} page - current page (1-based)
	 * @param {number} limit - number of items per page
	 * @param {number} totalItems - total number of items
	 * @returns {PagingResponseDto<T>}
	 * @version 1.0.0
	 */
	buildPagingResponse<T>(
		items: T[],
		page: number,
		limit: number,
		totalItems: number
	): PagingResponseDto<T> {
		/*
		 * Pagination meta
		 */
		const meta = new PagingMetaDto(page, limit, totalItems)
		return new PagingResponseDto(items, meta)
	}

	/**
	 * @description Calculate skip (offset) for pagination
	 * @param {number} page - current page (1-based)
	 * @param {number} limit - number of items per page
	 * @returns {number} skip number (0-based offset)
	 * @version 1.0.0
	 */
	calculateSkip(page = 1, limit = 10): number {
		if (page < 1) page = 1
		if (limit < 1) limit = 10 // default fallback
		return (page - 1) * limit
	}
}
