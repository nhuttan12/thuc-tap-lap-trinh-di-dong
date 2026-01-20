/**
 * @description Page item for paging
 * @author @nhuttan12
 * @since 2026-01-16
 * @version 1.0.0
 */

package com.example.e_commerce.Model

sealed class PageItem {
    object Prev : PageItem()
    data class Page(val page: Int, val isCurrent: Boolean) : PageItem()
    object Next : PageItem()
    data class Last(val page: Int) : PageItem()
}