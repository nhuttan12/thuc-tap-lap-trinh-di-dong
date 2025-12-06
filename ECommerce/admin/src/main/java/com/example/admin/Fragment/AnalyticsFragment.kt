package com.example.admin.Fragment

import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.admin.R

class AnalyticsFragment : Fragment(R.layout.fragment_analytics) {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // biểu đồ hiển thị

        view.findViewById<ImageButton>(R.id.btnBack).setOnClickListener {
            findNavController().navigateUp()
        }
    }
}