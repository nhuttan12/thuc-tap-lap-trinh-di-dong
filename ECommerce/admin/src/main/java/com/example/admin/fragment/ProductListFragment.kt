package com.example.admin.fragment

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import com.example.admin.R
import com.example.admin.databinding.FragmentProductListBinding

class ProductListFragment : Fragment(R.layout.fragment_product_list) {

    private var binding: FragmentProductListBinding? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentProductListBinding.bind(view)

        // Add FAB onClick (temporarily empty)
        binding!!.fabAddProduct.setOnClickListener { /* Open add form */ }
    }

    override fun onDestroyView() {
        binding = null
        super.onDestroyView()
    }
}