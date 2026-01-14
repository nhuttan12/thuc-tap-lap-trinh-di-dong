package com.example.admin.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.admin.adapter.ProductAdapter
import com.example.admin.model.Product
import com.example.admin.R
import com.example.admin.databinding.FragmentProductListBinding
import com.example.admin.mapper.ProductMapper
import com.example.admin.service.ApiService
import kotlinx.coroutines.launch

class ProductListFragment : Fragment() {

    private var _binding: FragmentProductListBinding? = null
    private val binding get() = _binding!!

    private lateinit var productAdapter: ProductAdapter

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProductListBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        setupListeners()
        loadProducts()
    }

    private fun setupRecyclerView() {
        productAdapter = ProductAdapter()

        productAdapter.onItemClick = { product: Product ->
            navigateToEdit(product.id)
        }

        productAdapter.onDeleteClick = { product: Product ->
            Toast.makeText(
                    requireContext(),
                    "Xóa sản phẩm ID = ${product.id}",
                    Toast.LENGTH_SHORT
            ).show()
        }

        binding.recyclerProducts.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = productAdapter
        }
    }

    private fun setupListeners() {
        binding.fabAddProduct.setOnClickListener {
            navigateToAdd()
        }

        binding.edtSearch.setOnEditorActionListener { _, _, _ ->
            // TODO: search sau
            false
        }
    }

    private fun loadProducts() {
        binding.progressBar.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                val response = ApiService.productService.getProducts()

                if (response.isSuccessful) {
                    val products = response.body()
                            ?.data
                            ?.data
                            ?.map { ProductMapper.toProduct(it) }
                            ?: emptyList<Product>()
                    productAdapter.submitList(products)
                } else {
                    Toast.makeText(
                            requireContext(),
                            "Không tải được danh sách sản phẩm",
                            Toast.LENGTH_SHORT
                    ).show()
                }

            } catch (e: Exception) {
                Toast.makeText(
                        requireContext(),
                        "Lỗi kết nối server",
                        Toast.LENGTH_SHORT
                ).show()
            } finally {
                binding.progressBar.visibility = View.GONE
            }
        }

        productAdapter.onDeleteClick = { product ->
            lifecycleScope.launch {
                try {
                    val response = ApiService.productService.deleteProduct(product.id)
                    if (response.isSuccessful) {
                        Toast.makeText(requireContext(), "Xóa thành công", Toast.LENGTH_SHORT).show()
                        loadProducts()  // ✅ Reload list
                    }
                } catch (e: Exception) {
                    Toast.makeText(requireContext(), "Lỗi xóa", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun navigateToEdit(productId: Int) {
        val bundle = Bundle().apply {
            putBoolean("isEditMode", true)
            putInt("productId", productId)
        }
        findNavController().navigate(R.id.action_productList_to_productForm, bundle)
    }

    private fun navigateToAdd() {
        val bundle = Bundle().apply {
            putBoolean("isEditMode", false)
            putInt("productId", 0)
        }
        findNavController().navigate(R.id.action_productList_to_productForm, bundle)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}