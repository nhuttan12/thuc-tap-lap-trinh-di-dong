package com.example.admin.fragment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.admin.R
import com.example.admin.adapter.ProductAdapter
import com.example.admin.databinding.FragmentProductListBinding
import com.example.admin.model.Product
import com.example.admin.viewmodel.ProductViewModel
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class ProductListFragment : Fragment() {

    private var _binding: FragmentProductListBinding? = null
    private val binding get() = _binding!!

    private lateinit var adapter: ProductAdapter
    private lateinit var viewModel: ProductViewModel

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

        // Init ViewModel
        viewModel = ProductViewModel()

        // Setup ViewModel observers
        setupViewModelObservers()

        // Init adapter với đầy đủ callbacks
        adapter = ProductAdapter(
                onItemClick = { product ->
                    navigateToProductForm(true, product.id, product)
                },
                onEditClick = { product ->
                    navigateToProductForm(true, product.id, product)
                },
                onDeleteClick = { product ->
                    showDeleteDialog(product)
                }
        )

        // Setup RecyclerView
        binding.recyclerProducts.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerProducts.adapter = adapter
        binding.recyclerProducts.setHasFixedSize(true)

        // Load data
        loadProducts()

        // Setup FAB
        binding.fabAddProduct.setOnClickListener {
            navigateToProductForm(false, 0, null)
        }

        // Setup search
        setupSearch()

        // Setup empty state
        setupEmptyState()

        // THÊM Fragment Result Listener
        parentFragmentManager.setFragmentResultListener(
                "refresh_products",  // KEY PHẢI KHỚP VỚI FORM
                viewLifecycleOwner
        ) { requestKey, bundle ->
            Log.d("ProductListFragment", "Received fragment result: $requestKey")

            if (bundle.getBoolean("refresh", false)) {
                // KIỂM TRA CACHE TRƯỚC KHI LOAD
                val productId = bundle.getInt("productId", 0)
                val action = bundle.getString("action", "update")

                // Nếu có productId cụ thể, tìm trong cache để update
                if (productId > 0) {
                    val cachedProduct = ProductCache.get(productId)
                    if (cachedProduct != null) {
                        Log.d("ProductListFragment", "Updating cached product: ${cachedProduct.name}")
                        updateProductInList(cachedProduct, action == "create")
                    }
                }

                // Force reload từ API
                viewModel.loadProducts(1)

                // Hiển thị snackbar
                val message = if (action == "update")
                    "Đã cập nhật sản phẩm"
                else
                    "Đã thêm sản phẩm mới"

                Snackbar.make(binding.root, message, Snackbar.LENGTH_SHORT).show()
            }
        }
    }

    // Thêm hàm để cập nhật product trong list
    private fun updateProductInList(updatedProduct: Product, isNewProduct: Boolean = false) {
        val currentList = adapter.currentList.toMutableList()

        if (isNewProduct) {
            // Thêm sản phẩm mới vào đầu list
            currentList.add(0, updatedProduct)
        } else {
            // Tìm và cập nhật sản phẩm đã có
            val index = currentList.indexOfFirst { it.id == updatedProduct.id }
            if (index != -1) {
                currentList[index] = updatedProduct
            } else {
                // Nếu không tìm thấy, thêm vào đầu list
                currentList.add(0, updatedProduct)
            }
        }

        // Submit list mới
        adapter.submitList(currentList)

        // Ẩn empty state nếu có
        showEmptyState(currentList.isEmpty(), "Danh sách sản phẩm trống")
    }
    private fun setupViewModelObservers() {
        viewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            showLoading(isLoading)

            // NẾU KHÔNG LOADING VÀ CHƯA CÓ DỮ LIỆU, LOAD LẠI
            if (!isLoading && (adapter.itemCount == 0)) {
                viewModel.loadProducts(1)
            }
        }

        viewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let {
                // Nếu có lỗi, thử load lại sau 2 giây
                lifecycleScope.launch {
                    delay(2000)
                    if (adapter.itemCount == 0) {
                        viewModel.loadProducts(1)
                    }
                }
                Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show()
                viewModel.clearError()
            }
        }

        viewModel.products.observe(viewLifecycleOwner) { products ->
            if (products.isEmpty()) {
                showEmptyState(true, "Danh sách sản phẩm trống")
            } else {
                showEmptyState(false)

                // KIỂM TRA VÀ CẬP NHẬT TỪ CACHE NẾU CẦN
                val updatedList = products.map { product ->
                    val cachedProduct = ProductCache.get(product.id)
                    cachedProduct ?: product
                }

                adapter.submitList(updatedList)
            }
        }
    }

    private fun setupEmptyState() {
        // Kiểm tra nếu có progress bar và empty state trong layout
        if (binding.progressBar == null) {
            Log.w("ProductListFragment", "ProgressBar not found in layout")
        }
    }

    // Trong ProductListFragment.kt - navigateToProductForm
    // Trong ProductListFragment.kt
    private fun navigateToProductForm(isEditMode: Boolean, productId: Int, product: Product?) {
        try {
            val bundle = Bundle().apply {
                putBoolean("isEditMode", isEditMode)
                putInt("productId", productId)

                if (product != null) {
                    // GỬI ĐẦY ĐỦ TẤT CẢ DỮ LIỆU
                    val preloadedData = hashMapOf<String, String>()

                    // Thông tin cơ bản
                    preloadedData["name"] = product.name
                    preloadedData["price"] = product.price.toString()
                    preloadedData["discount"] = product.discount.toString()
                    preloadedData["status"] = product.status

                    // Size và Color - ĐÃ được parse đúng trong ProductMapper
                    preloadedData["size"] = product.size
                    preloadedData["color"] = product.color
                    preloadedData["description"] = product.description

                    // Brand info - QUAN TRỌNG!
                    preloadedData["brand_id"] = product.brandId.toString()
                    preloadedData["brand_name"] = product.brand


                    // Nếu product không có category, mặc định là 1
                    val categoryId = if (product.category.isNotBlank()) {
                        // Có thể parse từ category name hoặc có thêm categoryId field
                        1 // Tạm thời mặc định
                    } else {
                        1
                    }
                    preloadedData["category_id"] = categoryId.toString()
                    preloadedData["category"] = product.category

                    // Rating - THÊM
                    preloadedData["rating"] = "0" // Tạm thời

                    Log.d("ProductListFragment", "Preloaded data for product ${product.id}: $preloadedData")

                    putSerializable("preloadedData", preloadedData)
                }
            }

            findNavController().navigate(R.id.action_productList_to_productForm, bundle)
        } catch (e: Exception) {
            Log.e("ProductListFragment", "Navigation error", e)
            Toast.makeText(requireContext(), "Lỗi mở form: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupSearch() {
        binding.edtSearch.setOnEditorActionListener { _, _, _ ->
            val keyword = binding.edtSearch.text.toString().trim()
            searchProducts(keyword)
            true
        }
    }

    private fun searchProducts(keyword: String) {
        // TODO: Implement search trong ViewModel
        Toast.makeText(requireContext(), "Search: $keyword", Toast.LENGTH_SHORT).show()
    }

    private fun loadProducts() {
        viewModel.loadProducts()
    }

    private fun showDeleteDialog(product: Product) {
        AlertDialog.Builder(requireContext())
                .setTitle("Xác nhận xoá")
                .setMessage("Bạn có chắc muốn xoá sản phẩm:\n${product.name}?")
                .setPositiveButton("Xoá") { dialog, _ ->
                    deleteProduct(product.id)
                    dialog.dismiss()
                }
                .setNegativeButton("Huỷ") { dialog, _ ->
                    dialog.dismiss()
                }
                .show()
    }

    private fun deleteProduct(productId: Int) {
        lifecycleScope.launch {
            try {
                // SỬA: Không truyền callback
                viewModel.deleteProduct(productId)
                // Hiển thị toast trong observer của error hoặc tự show
                Toast.makeText(requireContext(), "Đã xoá sản phẩm", Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Lỗi: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun showLoading(isLoading: Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.recyclerProducts.visibility = if (isLoading) View.GONE else View.VISIBLE
    }

    private fun showEmptyState(show: Boolean, message: String? = null) {
        // Có thể thêm empty state text view nếu cần
        if (show) {
            binding.recyclerProducts.visibility = View.GONE
            // Hiển thị empty state message
        } else {
            binding.recyclerProducts.visibility = View.VISIBLE
        }
    }

    override fun onResume() {
        super.onResume()
        // Refresh data khi quay lại fragment
        loadProducts()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}