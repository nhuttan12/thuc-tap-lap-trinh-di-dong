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
import com.example.admin.model.Product
import com.example.admin.repository.BrandRepository
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

            // Basic fields
            binding.edtName.setText(data["name"] ?: "")
            binding.edtPrice.setText(data["price"] ?: "0")
            binding.edtDiscount.setText(data["discount"] ?: "0")
            binding.autoCompleteStatus.setText(data["status"] ?: "ACTIVE", false)

            // FIX: SIZE - Xử lý empty string và null
            val dbSize = data["size"] ?: ""
            val displaySize = if (dbSize.isNotBlank()) {
                // Convert từ DB format sang form format
                parseSizeForForm(dbSize)
            } else {
                // Nếu empty, để trống (không set default)
                ""
            }
            binding.edtSize.setText(displaySize)

            // FIX: COLOR - Tương tự
            val dbColor = data["color"] ?: ""
            val displayColor = if (dbColor.isNotBlank()) {
                parseColorForForm(dbColor)
            } else {
                ""
            }
            binding.edtColor.setText(displayColor)

            // Description
            binding.edtDescription.setText(data["description"] ?: "")

            // Rating
            binding.edtRating.setText(data["rating"] ?: "0")

            // Category ID
            val categoryId = data["category_id"]?.toIntOrNull() ?: 1
            binding.edtCategoryId.setText(categoryId.toString())

            // Brand
            val brandId = data["brand_id"]?.toIntOrNull() ?: 2
            val brandName = data["brand_name"] ?: "Adidas"

            // Set brand dropdown
            if (brandId > 0 && brandName.isNotBlank()) {
                binding.autoCompleteBrand.setText(brandName, false)
                binding.edtBrandId.setText(brandId.toString())
            } else {
                binding.autoCompleteBrand.setText("Adidas", false)
                binding.edtBrandId.setText("2")
            }

            Log.d(TAG, "✅ Loaded: brand=$brandName (id=$brandId), size='$displaySize', color='$displayColor'")
        }
    }

    // THÊM các hàm parse mới
    private fun parseSizeForForm(sizeString: String): String {
        if (sizeString.isBlank()) return ""

        // Xử lý tất cả các trường hợp
        return when {
            // Nếu đã là format form (dấu chấm phẩy)
            sizeString.contains(";") -> sizeString

            // Format DB (dấu phẩy) -> convert sang dấu chấm phẩy
            sizeString.contains(",") -> {
                sizeString.split(",")
                        .map { it.trim() }
                        .filter { it.isNotBlank() }
                        .joinToString("; ")
            }

            // Chỉ một giá trị (thêm delimiter phù hợp)
            else -> sizeString.trim() + ";"
        }
    }

    private fun parseColorForForm(colorString: String): String {
        if (colorString.isBlank()) return ""

        return when {
            // Nếu đã là format form (dấu chấm phẩy)
            colorString.contains(";") -> colorString

            // Format DB (dấu phẩy) -> convert sang dấu chấm phẩy
            colorString.contains(",") -> {
                colorString.split(",")
                        .map { it.trim() }
                        .filter { it.isNotBlank() }
                        .joinToString("; ")
            }

            // Chỉ một giá trị (thêm delimiter phù hợp)
            else -> colorString.trim() + ";"
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
        binding.edtCategoryId.setText("1")
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
    // Thêm vào setupDropdowns()
    private fun setupDropdowns() {
        // Status dropdown
        val statuses = listOf("ACTIVE", "INACTIVE", "DRAFT", "DELETED")
        val statusAdapter = ArrayAdapter(
                requireContext(),
                android.R.layout.simple_dropdown_item_1line,
                statuses
        )
        binding.autoCompleteStatus.setAdapter(statusAdapter)

        // Brands dropdown
        val brands = listOf(
                Pair(1, "Nike"),
                Pair(2, "Adidas"),
                Pair(3, "Puma"),
                Pair(4, "Converse"),
                Pair(5, "Vans")
        )

        setupBrandDropdown(brands)
    }


    private fun setupListeners() {
        binding.btnBack.setOnClickListener { findNavController().navigateUp() }
        binding.btnCancel.setOnClickListener { findNavController().navigateUp() }
        binding.btnSave.setOnClickListener { saveProduct() }
    }

    // ---------------- LOAD PRODUCT ----------------
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
    // Cần thêm logic để load brand từ API response
    // Trong bindProductToUI()
    // Trong ProductFormFragment.kt
    // Trong ProductFormFragment.kt
    // Trong ProductFormFragment.kt - phiên bản đơn giản
    private fun bindProductToUI(product: Any) {
        // CHỈ XỬ LÝ Product, không xử lý ProductDetailDTO
        if (product is Product) {
            println("🔄 Loading Product to form: id=${product.id}")
            println("🔄 Size: ${product.size}, Color: ${product.color}")
            println("🔄 Brand: ${product.brand}, BrandId: ${product.brandId}")
            println("🔄 Rating: ${product.rating}")

            binding.edtName.setText(product.name)
            binding.edtPrice.setText(product.price.toString())
            binding.edtDiscount.setText(product.discount.toString())

            val displaySize = if (product.size.isBlank()) "" else {
                parseSizeForDisplay(product.size)
            }
            binding.edtSize.setText(displaySize)

            val displayColor = if (product.color.isBlank()) "" else {
                parseColorForDisplay(product.color)
            }
            binding.edtColor.setText(displayColor)

            binding.edtDescription.setText(product.description)
            binding.autoCompleteStatus.setText(product.status, false)

            // RATING
            binding.edtRating.setText(product.rating.toString())

            // CATEGORY ID
            val categoryId = if (product.categoryId > 0) product.categoryId else 1
            binding.edtCategoryId.setText(categoryId.toString())

            // BRAND
            if (product.brand.isNotBlank() && product.brandId > 0) {
                val brands = getDefaultBrands()
                val brand = brands.find { it.first == product.brandId }
                if (brand != null) {
                    binding.autoCompleteBrand.setText(brand.second, false)
                    binding.edtBrandId.setText(brand.first.toString())
                } else {
                    binding.autoCompleteBrand.setText("Adidas", false)
                    binding.edtBrandId.setText("2")
                }
            } else {
                binding.autoCompleteBrand.setText("Adidas", false)
                binding.edtBrandId.setText("2")
            }

            println("✅ Form loaded successfully")
            println("✅ Display Size: $displaySize, Display Color: $displayColor")
        } else {
            println("⚠️ Unexpected product type: ${product.javaClass.name}")
            Toast.makeText(requireContext(), "Lỗi: Kiểu dữ liệu không hợp lệ", Toast.LENGTH_SHORT).show()
        }
    }

    // Helper để parse color string cho display
    private fun parseColorStringForDisplay(colorString: String): String {
        if (colorString.isBlank()) return "Đen"

        // Nếu là string chứa delimiter
        return if (colorString.contains(";")) {
            colorString.split(";").map { it.trim() }.filter { it.isNotBlank() }.joinToString(",")
        } else {
            colorString // Giữ nguyên nếu không có delimiter
        }
    }

    // ---------------- SAVE ----------------
    // Trong saveProduct() của ProductFormFragment
    // Trong ProductFormFragment.kt - saveProduct()
    private fun saveProduct() {
        if (!validateForm()) return
        showLoading(true)

        lifecycleScope.launch {
            try {
                // Lấy các giá trị từ form
                val name = binding.edtName.text.toString().trim()
                val price = binding.edtPrice.text.toString().toDoubleOrNull() ?: 0.0
                val discount = binding.edtDiscount.text.toString().toDoubleOrNull() ?: 0.0
                val rating = binding.edtRating.text.toString().toFloatOrNull() ?: 0f
                val status = binding.autoCompleteStatus.text.toString().trim()
                val brandId = binding.edtBrandId.text.toString().toIntOrNull() ?: 2  // Mặc định Adidas
                val categoryId = binding.edtCategoryId.text.toString().toIntOrNull() ?: 1  // Mặc định 1

                // Convert từ display format (39; 40; 41) sang BE format (39; 40; 41)
                // Giữ nguyên dấu chấm phẩy cho BE
                val sizeInput = binding.edtSize.text.toString().trim()
                val sizeForBE = if (sizeInput.isBlank()) {
                    ""  // Gửi empty string thay vì "37"
                } else {
                    sizeInput.split(";").map { it.trim() }.joinToString("; ")
                }

                val colorInput = binding.edtColor.text.toString().trim()
                val colorForBE = if (colorInput.isBlank()) {
                    ""  // Gửi empty string thay vì "Đen"
                } else {
                    colorInput.split(";").map { it.trim() }.joinToString("; ")
                }

                val description = binding.edtDescription.text.toString().trim()

                println("💾 Saving product:")
                println("💾 Name: $name, Price: $price, Discount: $discount, Rating: $rating")
                println("💾 Status: $status, CategoryId: $categoryId, BrandId: $brandId")
                println("💾 Size (BE format): $sizeForBE")
                println("💾 Color (BE format): $colorForBE")
                println("💾 Description length: ${description.length}")

                val response = if (isEditMode) {
                    // UPDATE
                    val updateRequest = com.example.admin.service.UpdateProductRequest(
                            name = name,
                            price = price,
                            discount = discount,
                            rating = rating,
                            status = status,
                            category_id = categoryId,
                            brand_id = brandId,
                            size = if (sizeForBE.isNotBlank()) sizeForBE else null,  // Gửi null nếu empty
                            color = if (colorForBE.isNotBlank()) colorForBE else null, // Gửi null nếu empty
                            description = if (description.isNotBlank()) description else null
                    )
                    println("📤 Update request: $updateRequest")
                    ApiService.productService.updateProduct(productId, updateRequest)
                } else {
                    // CREATE
                    val createRequest = com.example.admin.service.CreateProductRequest(
                            name = name,
                            price = price,
                            discount = discount,
                            rating = rating,
                            status = status,
                            category_id = categoryId,
                            brand_id = brandId,
                            size = if (sizeForBE.isNotBlank()) sizeForBE else null,
                            color = if (colorForBE.isNotBlank()) colorForBE else null,
                            description = if (description.isNotBlank()) description else null
                    )
                    println("📤 Create request: $createRequest")
                    ApiService.productService.createProduct(createRequest)
                }

                if (response.isSuccessful) {
                    // 1. Tạo Product object với đầy đủ thông tin
                    val savedProduct = Product(
                            id = if (isEditMode) productId else (response.body()?.data?.id ?: 0),
                            name = name,
                            price = price,
                            discount = discount,
                            status = status,
                            size = sizeForBE,
                            color = colorForBE,
                            description = description,
                            rating = rating,
                            categoryId = categoryId,
                            brandId = brandId,
                            category = getCategoryName(categoryId),  // Lấy tên từ mapping
                            brand = getBrandName(brandId),           // Lấy tên từ mapping
                            imageUrl = "" // TODO: Lấy từ response nếu có
                    )

                    // 2. Cache lại product (quan trọng!)
                    ProductCache.save(savedProduct)

                    // 3. Gửi fragment result để refresh
                    parentFragmentManager.setFragmentResult(
                            "product_updated",
                            Bundle().apply {
                                putBoolean("refresh", true)
                                putString("action", if (isEditMode) "update" else "create")
                                // Gửi cả product data
                                putInt("productId", savedProduct.id)
                            }
                    )

                    Toast.makeText(requireContext(),
                            if (isEditMode) "Cập nhật thành công" else "Thêm sản phẩm thành công",
                            Toast.LENGTH_SHORT
                    ).show()

                    findNavController().popBackStack()
                }

            } catch (e: Exception) {
                println("❌ Save product error: ${e.message}")
                e.printStackTrace()
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

        val rating = binding.edtRating.text.toString().toFloatOrNull()
        if (rating != null && (rating < 0 || rating > 5)) {
            binding.textInputRating.error = "Đánh giá phải từ 0-5"
            isValid = false
        }
        // TODO: Validate brand khi cần

        val categoryId = binding.edtCategoryId.text.toString().toIntOrNull()
        if (categoryId == null || categoryId <= 0) {
            binding.textInputCategoryId.error = "ID danh mục phải > 0"
            isValid = false
        }
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
                    source.filter {
                        it.isDigit() || it == ',' || it == ';' || it == ' ' || it == '.'
                    }
                }
        )

        binding.edtColor.filters = arrayOf(
                InputFilter { source, _, _, _, _, _ ->
                    // Cho phép chữ, dấu phẩy, chấm phẩy, space
                    source.filter {
                        it.isLetter() || it == ',' || it == ';' || it == ' '
                    }
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

    private suspend fun loadBrandsFromAPI(): List<Pair<Int, String>> {
        return try {
            val brands = BrandRepository().getBrands(limit = 50)  // THÊM limit
            if (brands.isNotEmpty()) {
                brands.map { Pair(it.id, it.name) }
            } else {
                getDefaultBrands()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to load brands from API", e)
            getDefaultBrands()
        }
    }

    private fun getDefaultBrands(): List<Pair<Int, String>> {
        return listOf(
                Pair(1, "Nike"),
                Pair(2, "Adidas"),
                Pair(3, "Puma"),
                Pair(4, "Converse"),
                Pair(5, "Vans")
        )
    }

    private fun setupBrandDropdown(brands: List<Pair<Int, String>>) {
        if (brands.isEmpty()) return

        val brandNames = brands.map { it.second }
        val brandAdapter = ArrayAdapter(
                requireContext(),
                android.R.layout.simple_dropdown_item_1line,
                brandNames
        )
        binding.autoCompleteBrand.setAdapter(brandAdapter)
        binding.autoCompleteBrand.setOnItemClickListener { _, _, position, _ ->
            val selectedBrand = brands[position]
            binding.autoCompleteBrand.setText(selectedBrand.second, false)
            binding.edtBrandId.setText(selectedBrand.first.toString())
            Log.d(TAG, "Selected brand: ${selectedBrand.second} (id=${selectedBrand.first})")
        }

        // Set default brand (dựa trên preloaded data nếu có)
        if (isEditMode) {
            // Trong edit mode, brand sẽ được set trong loadPreloadedData()
        } else {
            // Create mode: default là Adidas
            val defaultBrand = brands.find { it.first == 2 } ?: brands.first()
            binding.autoCompleteBrand.setText(defaultBrand.second, false)
            binding.edtBrandId.setText(defaultBrand.first.toString())
        }
    }


    // Helper để parse size cho form display
    private fun parseSizeForDisplay(sizeString: String): String {
        if (sizeString.isBlank()) return ""

        return when {
            // Nếu đã là format database (dấu chấm phẩy)
            sizeString.contains(";") -> {
                // Giữ nguyên format: "39; 40; 41"
                sizeString
            }
            // Nếu là format cũ (dấu phẩy)
            sizeString.contains(",") -> {
                // Convert: "39,40,41" -> "39; 40; 41"
                sizeString.split(",")
                        .map { it.trim() }
                        .filter { it.isNotBlank() }
                        .joinToString("; ")
            }
            // Chỉ một giá trị
            else -> sizeString.trim()
        }
    }

    // Helper để parse color cho form display
    private fun parseColorForDisplay(colorString: String): String {
        if (colorString.isBlank()) return ""

        return when {
            // Nếu đã là format database (dấu chấm phẩy)
            colorString.contains(";") -> {
                // Giữ nguyên format: "Đỏ; Xanh; Đen"
                colorString
            }
            // Nếu là format cũ (dấu phẩy)
            colorString.contains(",") -> {
                // Convert: "Đỏ,Xanh,Đen" -> "Đỏ; Xanh; Đen"
                colorString.split(",")
                        .map { it.trim() }
                        .filter { it.isNotBlank() }
                        .joinToString("; ")
            }
            // Chỉ một giá trị
            else -> colorString.trim()
        }
    }

    private fun getBrandName(brandId: Int): String {
        return when (brandId) {
            1 -> "Nike"
            2 -> "Adidas"
            3 -> "Puma"
            4 -> "Converse"
            5 -> "Vans"
            else -> "Thương hiệu $brandId"
        }
    }

    private fun getCategoryName(categoryId: Int): String {
        return when (categoryId) {
            1 -> "Thể thao"
            2 -> "Thời trang"
            3 -> "Giày dép"
            else -> "Danh mục $categoryId"
        }
    }
}