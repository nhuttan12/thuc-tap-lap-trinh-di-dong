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
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.example.admin.databinding.FragmentProductFormBinding
import com.example.admin.dto.CategoryDTO
import com.example.admin.dto.ProductDTO
import com.example.admin.service.ApiService
import com.example.admin.service.CreateProductRequest
import com.example.admin.service.ProductDetailsRequest
import com.example.admin.service.UpdateProductRequest
import com.google.gson.Gson
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class ProductFormFragment : Fragment() {

    private var _binding: FragmentProductFormBinding? = null
    private val binding get() = _binding!!

//    private val args: ProductFormFragmentArgs by navArgs()

    private var isEditMode = false
    private var productId = 0

    companion object {
        private const val TAG = "ProductFormFragment"
    }

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProductFormBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        arguments?.let { bundle ->
            isEditMode = bundle.getBoolean("isEditMode", false)
            productId = bundle.getInt("productId", 0)
        }

        setupUI()
        setupSpinners()
        setupListeners()

        if (isEditMode) {
            loadProduct(productId)
        }
        setupInputFilters()
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
    }

    private fun setupSpinners() {
        // Status - chỉ setup 1 lần
        if (binding.spinnerStatus.adapter == null) {
            binding.spinnerStatus.adapter = ArrayAdapter(
                    requireContext(), android.R.layout.simple_spinner_item,
                    listOf("ACTIVE", "INACTIVE")
            ).apply { setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item) }
        }

        // Category - chỉ setup 1 lần
        if (binding.spinnerCategory.adapter == null) {
            val categories = listOf("Giày nam", "Giày nữ", "Giày thể thao")
            binding.spinnerCategory.adapter = ArrayAdapter(
                    requireContext(), android.R.layout.simple_spinner_item, categories
            ).apply { setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item) }
        }
    }


    private fun setupListeners() {
        binding.btnBack.setOnClickListener { findNavController().navigateUp() }
        binding.btnCancel.setOnClickListener { findNavController().navigateUp() }
        binding.btnSave.setOnClickListener { saveProduct() }
    }

    // ---------------- LOAD PRODUCT ----------------

    private fun loadProduct(id: Int) {
        lifecycleScope.launch {
            try {
                val response = ApiService.productService.getProductById(id)

                if (!response.isSuccessful) {
                    Toast.makeText(requireContext(), "Không tải được sản phẩm", Toast.LENGTH_SHORT).show()
                    return@launch
                }

                val product = response.body()?.data ?: return@launch

                // ✅ Debug: log ra data nhận được
                Log.d(TAG, "Loaded product: ${Gson().toJson(product)}")
                Log.d(TAG, "Category from API: id=${product.productDetailsEntity?.categoryEntity?.id}, name=${product.productDetailsEntity?.categoryEntity?.name}")

                bindProductToUI(product)

            } catch (e: Exception) {
                Log.e(TAG, "Load product error", e)
                Toast.makeText(requireContext(), "Lỗi tải sản phẩm", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun bindProductToUI(product: ProductDTO) {
        binding.edtName.setText(product.name)
        binding.edtPrice.setText(product.price.toString())
        binding.edtDiscount.setText(product.discount.toString())

        val details = product.productDetailsEntity

        // description
        binding.edtDescription.setText(details?.description.orEmpty())

        // ✅ SỬA: size là String, không phải List<String>
        val sizeText = details?.size ?: ""
        binding.edtSize.setText(sizeText)

        // color
        binding.edtColor.setText(details?.color.orEmpty())

        // status
        val statusIndex = (binding.spinnerStatus.adapter as ArrayAdapter<String>)
                .getPosition(product.status)
        binding.spinnerStatus.setSelection(if (statusIndex >= 0) statusIndex else 0)

        // category
        val categories = listOf(
                CategoryDTO(1, "Giày nam"),
                CategoryDTO(2, "Giày nữ"),
                CategoryDTO(3, "Giày thể thao")
        )

        val index = categories.indexOfFirst {
            it.id == details?.categoryEntity?.id
        }

        if (index >= 0) {
            binding.spinnerCategory.setSelection(index)
        } else {
            binding.spinnerCategory.setSelection(0)
        }
    }


    // ---------------- SAVE ----------------

    private fun saveProduct() {
        if (!validateForm()) return

        binding.progressBar.visibility = View.VISIBLE
        binding.btnSave.isEnabled = false

        lifecycleScope.launch {
            try {
                val name = binding.edtName.text.toString().trim()
                val price = binding.edtPrice.text.toString().toDouble()
                val discount = binding.edtDiscount.text.toString().toDoubleOrNull() ?: 0.0
                val status = binding.spinnerStatus.selectedItem.toString()
                val sizeString = binding.edtSize.text.toString().trim()
                val sizeForRequest = if (sizeString.isEmpty()) "" else sizeString
                val color = binding.edtColor.text.toString().trim()
                val description = binding.edtDescription.text.toString().trim()

                val categories = listOf(
                        CategoryDTO(1, "Giày nam"),
                        CategoryDTO(2, "Giày nữ"),
                        CategoryDTO(3, "Giày thể thao")
                )
                val categoryId = categories[binding.spinnerCategory.selectedItemPosition].id

                // ✅ Debug log để kiểm tra data
                Log.d(TAG, "Saving product: name=$name, price=$price, categoryId=$categoryId")
                Log.d(TAG, "Size: '$sizeString', Color: '$color', Desc: '$description'")

                val response = if (isEditMode) {
                    // ✅ Cách 1: Gửi category_id ở root level
                    val updateRequest = UpdateProductRequest(
                            name = name,
                            price = price,
                            discount = discount,
                            status = status,
                            // ✅ Gửi ở root level
                            size = sizeForRequest,
                            color = color,
                            description = description,
                            category_id = categoryId,
                            // ✅ Và trong productDetailsEntity để đảm bảo
                            productDetailsEntity = ProductDetailsRequest(
                                    size = sizeString,
                                    color = color,
                                    description = description,
                                    category_id = categoryId
                            )
                    )


                    ApiService.productService.updateProduct(productId, updateRequest)
                } else {
                    val createRequest = CreateProductRequest(
                            name = name,
                            price = price,
                            discount = discount,
                            status = status,
                            category_id = categoryId,
                            size = sizeString,
                            color = color,
                            description = description
                    )


                    ApiService.productService.createProduct(createRequest)
                }

                if (response.isSuccessful) {
                    Toast.makeText(
                            requireContext(),
                            if (isEditMode) "Cập nhật thành công" else "Thêm sản phẩm thành công",
                            Toast.LENGTH_SHORT
                    ).show()

                    if (isEditMode) {
                        // ✅ QUAN TRỌNG: Load lại sau khi update
                        // Đợi 1 chút để server xử lý xong
                        delay(300)
                        loadProduct(productId)
                    } else {
                        findNavController().navigateUp()
                    }
                } else {
                    val errorBody = response.errorBody()?.string()
                    Log.e(TAG, "Server error: $errorBody")
                    Toast.makeText(
                            requireContext(),
                            "Lỗi: ${response.message()}",
                            Toast.LENGTH_LONG
                    ).show()
                }

            } catch (e: Exception) {
                Log.e(TAG, "Save product error", e)
                Toast.makeText(requireContext(), "Lỗi: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                binding.progressBar.visibility = View.GONE
                binding.btnSave.isEnabled = true
            }
        }
    }


    private fun validateForm(): Boolean {
        if (binding.edtName.text.isNullOrBlank()) {
            binding.edtName.error = "Nhập tên sản phẩm"
            return false
        }

        val price = binding.edtPrice.text.toString().toDoubleOrNull()
        if (price == null || price <= 0) {
            binding.edtPrice.error = "Giá phải > 0"
            return false
        }

        return true
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun setupInputFilters() {
        binding.edtSize.filters = arrayOf(
                InputFilter { source, _, _, _, _, _ ->
                    source.filter { it.isDigit() || it == ',' }
                }
        )
    }
}
