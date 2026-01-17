package com.example.admin.fragment

import android.os.Bundle
import android.text.InputFilter
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.example.admin.databinding.FragmentProductFormBinding
import com.example.admin.dto.ProductDetailDTO
import com.example.admin.model.Product
import com.example.admin.service.ApiService
import com.example.admin.viewmodel.ProductViewModel
import kotlinx.coroutines.launch

class ProductFormFragment : Fragment() {

    private var _binding: FragmentProductFormBinding? = null
    private val binding get() = _binding!!

    private var isEditMode = false
    private var productId = 0


    companion object {
        private const val TAG = "ProductFormFragment"
        private const val DEFAULT_SIZE = "37"
        private const val DEFAULT_COLOR = "Đen"
        private const val DEFAULT_CATEGORY_ID = 1
    }

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProductFormBinding.inflate(inflater, container, false)
        return binding.root
    }


    private var preloadedData: Map<String, String>? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        arguments?.let { bundle ->
            isEditMode = bundle.getBoolean("isEditMode", false)
            productId = bundle.getInt("productId", 0)

            // Lấy preloaded data
            if (bundle.containsKey("preloadedData")) {
                preloadedData = bundle.getSerializable("preloadedData") as? Map<String, String>
                Log.d(TAG, "Got preloaded data: $preloadedData")
            }
        }

        setupUI()
        setupDropdowns()
        setupListeners()
        setupInputFilters()

        if (isEditMode) {
            if (preloadedData != null) {
                // Nếu có preloaded data, dùng luôn (không cần gọi API)
                loadPreloadedData()
            } else {
                // Nếu không có, mới gọi API
                loadProduct(productId)
            }
        }
    }

    private fun loadPreloadedData() {
        preloadedData?.let { data ->
            Log.d(TAG, "Loading preloaded data: $data")

            binding.edtName.setText(data["name"] ?: "")
            binding.edtPrice.setText(data["price"] ?: "0")
            binding.edtDiscount.setText(data["discount"] ?: "0")
            binding.edtSize.setText(data["size"] ?: "")
            binding.edtColor.setText(data["color"] ?: "")
            binding.edtDescription.setText(data["description"] ?: "")

            val status = data["status"] ?: "ACTIVE"
            binding.autoCompleteStatus.setText(status, false)

            // Không cần show loading vì data đã có sẵn
        }
    }
    // ---------------- UI ----------------
    private fun setupUI() {
        binding.tvScreenTitle.text =
                if (isEditMode) "Chỉnh sửa sản phẩm" else "Thêm sản phẩm"

        binding.btnSave.text =
                if (isEditMode) "Cập nhật" else "Lưu"

        binding.tvProductId.apply {
            text = "ID: $productId"
            visibility = if (isEditMode) View.VISIBLE else View.GONE
        }

        // KIỂM TRA XEM ID CÓ TỒN TẠI TRƯỚC KHI SỬ DỤNG
//        try {
//
//            val categoryLayout = binding.root.findViewById<View>(R.id.textInputCategory)
//            categoryLayout?.visibility = View.GONE
//
//
//            if (::binding.isInitialized && (binding.textInputCategory != null)) {
//                binding.textInputCategory.visibility = View.GONE
//            }
//        } catch (e: Exception) {
//            Log.w(TAG, "textInputCategory not found in layout, skipping hide")
//        }
    }
    private fun setupDropdowns() {
        // Setup Status dropdown
        val statuses = listOf("ACTIVE", "INACTIVE", "DRAFT")
        val statusAdapter = ArrayAdapter(
                requireContext(),
                android.R.layout.simple_dropdown_item_1line,
                statuses
        )
        binding.autoCompleteStatus.setAdapter(statusAdapter)

        // Set default value cho create mode
        if (!isEditMode) {
            binding.autoCompleteStatus.setText("ACTIVE", false)
        }

        // TODO: Setup Brand dropdown khi có API brands
        // Tạm thời dùng hardcoded brands
        val brands = listOf("Nike", "Adidas", "Puma", "Converse", "Vans")
        val brandAdapter = ArrayAdapter(
                requireContext(),
                android.R.layout.simple_dropdown_item_1line,
                brands
        )
        binding.autoCompleteBrand.setAdapter(brandAdapter)
    }

    private fun setupListeners() {
        binding.btnBack.setOnClickListener { findNavController().navigateUp() }
        binding.btnCancel.setOnClickListener { findNavController().navigateUp() }
        binding.btnSave.setOnClickListener { saveProduct() }
    }

    // ---------------- LOAD PRODUCT ----------------
    // ProductFormFragment.kt
    // ProductFormFragment.kt
    // ProductFormFragment.kt - phần loadProduct
    private fun loadProduct(id: Int) {
        val viewModel: ProductViewModel by viewModels()

        viewModel.getProductDetail(
                id = id,
                onSuccess = { product ->
                    bindProductToUI(product)
                },
                onError = { error ->
                    Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show()
                }
        )
    }

    // ProductFormFragment.kt
    private fun bindProductToUI(product: Any) {
        when (product) {
            is Product -> {
                // Nếu là Product từ list
                binding.edtName.setText(product.name)
                binding.edtPrice.setText(product.price.toString())
                binding.edtDiscount.setText(product.discount.toString())
                binding.edtSize.setText(product.size)
                binding.edtColor.setText(product.color)
                binding.edtDescription.setText(product.description)
                binding.autoCompleteStatus.setText(product.status, false)
            }
            is ProductDetailDTO -> {
                // Nếu là ProductDetailDTO từ API detail
                binding.edtName.setText(product.name)
                binding.edtPrice.setText(product.price.toString())
                binding.edtDiscount.setText(product.discount.toString())
                val sizeText = product.size.filter { it.isNotBlank() }.joinToString(",")
                binding.edtSize.setText(sizeText)
                binding.edtColor.setText(product.color)
                binding.edtDescription.setText(product.description)
                binding.autoCompleteStatus.setText("ACTIVE", false) // Default
            }
        }

        // Debug log
        Log.d(TAG, "Product loaded: ${product::class.java.simpleName}")
    }

    // ---------------- SAVE ----------------
    // Trong saveProduct() của ProductFormFragment
    private fun saveProduct() {
        if (!validateForm()) return

        showLoading(true)

        lifecycleScope.launch {
            try {
                val name = binding.edtName.text.toString().trim()

                // FIX: Format price đúng cách
                val priceText = binding.edtPrice.text.toString().trim()
                val price = priceText.toDoubleOrNull() ?: 0.0
                // Hoặc nếu backend yêu cầu số nguyên:
                // val price = priceText.toDoubleOrNull()?.toInt() ?: 0

                val discount = binding.edtDiscount.text.toString().toDoubleOrNull() ?: 0.0
                val status = binding.autoCompleteStatus.text.toString().trim()
                val sizeString = binding.edtSize.text.toString().trim()
                val color = binding.edtColor.text.toString().trim()
                val description = binding.edtDescription.text.toString().trim()

                val safeSize = if (sizeString.isBlank()) "37" else sizeString
                val safeColor = if (color.isBlank()) "Đen" else color
                val safeDescription = if (description.isBlank()) "" else description

                Log.d(TAG, "Saving product: name=$name, price=$price, size=$safeSize, color=$safeColor")

                val response = if (isEditMode) {
                    // UPDATE
                    val updateRequest = com.example.admin.service.UpdateProductRequest(
                            name = name,
                            price = price,
                            discount = discount,
                            status = status,
                            size = safeSize,
                            color = safeColor,
                            description = safeDescription

                    )
                    ApiService.productService.updateProduct(productId, updateRequest)
                } else {
                    // CREATE
                    val createRequest = com.example.admin.service.CreateProductRequest(
                            name = name,
                            price = price,
                            discount = discount,
                            status = status,
                            category_id = DEFAULT_CATEGORY_ID,  // <-- THÊM category_id
                            size = if (sizeString.isBlank()) DEFAULT_SIZE else sizeString,
                            color = if (color.isBlank()) DEFAULT_COLOR else color,
                            description = description
                    )
                    Log.d(TAG, "Create request: $createRequest")
                    ApiService.productService.createProduct(createRequest)
                }

                if (response.isSuccessful) {
                    val message = if (isEditMode) "Cập nhật thành công" else "Thêm sản phẩm thành công"
                    Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()

                    findNavController().navigateUp()

                } else {
                    val errorBody = response.errorBody()?.string()
                    Log.e(TAG, "Server error: $errorBody")
                    Toast.makeText(
                            requireContext(),
                            "Lỗi: ${response.message()} - ${errorBody?.take(100)}",
                            Toast.LENGTH_LONG
                    ).show()
                }

            } catch (e: Exception) {
                Log.e(TAG, "Save product error", e)
                Toast.makeText(requireContext(), "Lỗi: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                showLoading(false)
            }
        }
    }

    private fun validateForm(): Boolean {
        var isValid = true

        // Reset errors
        binding.textInputName.error = null
        binding.textInputPrice.error = null

        // Validate name
        if (binding.edtName.text.isNullOrBlank()) {
            binding.textInputName.error = "Nhập tên sản phẩm"
            isValid = false
        }

        // Validate price
        val price = binding.edtPrice.text.toString().toDoubleOrNull()
        if (price == null || price <= 0) {
            binding.textInputPrice.error = "Giá phải > 0"
            isValid = false
        }

        // Validate status
        if (binding.autoCompleteStatus.text.isNullOrBlank()) {
            binding.autoCompleteStatus.error = "Chọn trạng thái"
            isValid = false
        }

        // TODO: Validate brand khi cần

        return isValid
    }

    private fun showLoading(show: Boolean) {
        binding.progressBar.visibility = if (show) View.VISIBLE else View.GONE
        binding.btnSave.isEnabled = !show
        binding.btnCancel.isEnabled = !show
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun setupInputFilters() {
        binding.edtSize.filters = arrayOf(
                InputFilter { source, _, _, _, _, _ ->
                    source.filter { it.isDigit() || it == ',' || it == ' ' }
                }
        )

        // Thêm cho price để tránh số khoa học
        binding.edtPrice.filters = arrayOf(
                InputFilter { source, start, end, dest, dstart, dend ->
                    val newText = dest.toString().substring(0, dstart) +
                            source.subSequence(start, end) +
                            dest.toString().substring(dend)

                    // Chỉ cho phép số và dấu chấm (cho decimal)
                    val pattern = Regex("^\\d*\\.?\\d*$")
                    if (pattern.matches(newText)) {
                        null // Accept
                    } else {
                        "" // Reject
                    }
                }
        )
    }
}