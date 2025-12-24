/**
 * @description Moshi provider for configuring Moshi
 * @author @nhuttan12
 * @since 2025-12-22
 * @version 1.0.0
 */

package com.example.e_commerce.Provider

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

object MoshiProvider {
    val moshi: Moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()
}