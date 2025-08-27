package com.example.e_commerce.CustomComponent

import android.content.Context
import android.util.AttributeSet
import android.view.WindowInsets
import com.google.android.material.bottomnavigation.BottomNavigationView

class NoInsetBottomNav @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : BottomNavigationView(context, attrs, defStyleAttr) {

    override fun onApplyWindowInsets(insets: WindowInsets): WindowInsets {
        // Lấy insets hiện tại
        val newInsets = insets.replaceSystemWindowInsets(
            insets.systemWindowInsetLeft,
            insets.systemWindowInsetTop,
            insets.systemWindowInsetRight,
            0 // ép bottom = 0
        )

        return super.onApplyWindowInsets(newInsets)
    }

}