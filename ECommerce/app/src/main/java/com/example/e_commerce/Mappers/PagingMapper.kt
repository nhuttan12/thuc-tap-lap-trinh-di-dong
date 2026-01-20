/**
 * @description Mapper for PageItem
 * @author @nhuttan12
 * @since 2026-01-16
 * @version 1.0.0
 */

package com.example.e_commerce.Mappers

import com.example.e_commerce.DTOs.Response.PagingMeta
import com.example.e_commerce.Model.PageItem

object PagingMapper {
    fun toPageItem(meta: PagingMeta): List<PageItem> {
        val items = mutableListOf<PageItem>()

        if (meta.hasPreviousPage) {
            items += PageItem.Prev
        }

        val start = maxOf(1, meta.page - 1)
        val end = minOf(meta.totalPages, meta.page + 1)

        for (p in start..end) {
            items += PageItem.Page(
                page = p,
                isCurrent = p == meta.page
            )
        }

        if (meta.page < meta.totalPages - 1) {
            items += PageItem.Last(meta.totalPages)
        }

        if (meta.hasNextPage) {
            items += PageItem.Next
        }

        return items
    }
}