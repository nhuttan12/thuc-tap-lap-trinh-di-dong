package com.example.admin.fragment

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.admin.R
import com.example.admin.adapter.ProductSearchAdapter
import com.example.admin.adapter.SelectedProductAdapter
import com.example.admin.databinding.FragmentOrderFormBinding
import com.example.admin.model.Product
import com.example.admin.viewmodel.OrderViewModel
import com.example.admin.viewmodel.UserViewModel
import com.example.admin.viewmodel.ProductViewModel
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class OrderFormFragment : Fragment() {

    private var _binding: FragmentOrderFormBinding? = null
    private val binding get() = _binding!!

    private lateinit var orderViewModel: OrderViewModel
    private lateinit var userViewModel: UserViewModel
    private lateinit var productViewModel: ProductViewModel

    private lateinit var productSearchAdapter: ProductSearchAdapter
    private lateinit var selectedProductAdapter: SelectedProductAdapter

    private var orderId: Int = 0
    private var selectedUserId: Int? = null
    private val selectedProducts = mutableListOf<com.example.admin.dto.CreateOrderItemRequest>()

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        _binding = FragmentOrderFormBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        orderId = arguments?.getInt("orderId", 0) ?: 0

        setupViewModels()
        setupUI()
        setupObservers()
        loadUsers()

        if (orderId > 0) {
            binding.tvTitle.text = "Chỉnh sửa đơn hàng"
            loadOrderData()
        } else {
            binding.tvTitle.text = "Tạo đơn hàng mới"
        }
    }

    private fun setupViewModels() {
        orderViewModel = ViewModelProvider(this)[OrderViewModel::class.java]
        userViewModel = ViewModelProvider(this)[UserViewModel::class.java]
        productViewModel = ViewModelProvider(this)[ProductViewModel::class.java]
    }

    private fun setupUI() {
        // Back button
        binding.toolbar.setNavigationOnClickListener {
            findNavController().navigateUp()
        }

        // Save button
        binding.btnSave.setOnClickListener {
            saveOrder()
        }

        // Search product button
        binding.btnSearchProduct.setOnClickListener {
            searchProducts()
        }

        // User dropdown
        binding.autoCompleteUser.setOnItemClickListener { _, _, position, _ ->
            val users = userViewModel.users.value
            if (users != null && position < users.size) {
                val user = users[position]
                selectedUserId = user.id
                displaySelectedUser(user)
            }
        }

        // Clear user selection when text is cleared
//        binding.autoCompleteUser.setOnFocusChangeListener { _, hasFocus ->
//            if (!hasFocus && binding.autoCompleteUser.text.toString().isEmpty()) {
//                selectedUserId = null
//                binding.cardSelectedUser.visibility = View.GONE
//            }
//        }

        // Status dropdown
        // Status dropdown - DÙNG ĐÚNG 6 GIÁ TRỊ TỪ DATABASE
        val statuses = listOf(
                "PENDING",      // Chờ xử lý
                "CONFIRMED",    // Đã xác nhận
                "PROCESSING",   // Đang xử lý
                "COMPLETED",    // Đã hoàn thành
                "CANCELED",     // Đã hủy (1 chữ L)
                "ON_HOLD"       // Tạm hoãn
        )

        val statusAdapter = ArrayAdapter(
                requireContext(),
                android.R.layout.simple_dropdown_item_1line,
                statuses
        )
        binding.autoCompleteStatus.setAdapter(statusAdapter)
        binding.autoCompleteStatus.setText("PENDING", false)
        // Product search field - search on enter
        binding.edtSearchProduct.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == android.view.inputmethod.EditorInfo.IME_ACTION_SEARCH) {
                searchProducts()
                true
            } else {
                false
            }
        }

        // Setup adapters
        setupAdapters()
    }

    private fun setupAdapters() {
        // Product search adapter
        productSearchAdapter = ProductSearchAdapter(
                onAddClick = { product ->
                    showQuantityDialog(product)
                }
        )
        binding.recyclerProducts.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerProducts.adapter = productSearchAdapter

        // Selected products adapter
        selectedProductAdapter = SelectedProductAdapter(
                onRemoveClick = { productId ->
                    removeProduct(productId)
                },
                onQuantityChange = { productId, newQuantity ->
                    updateProductQuantity(productId, newQuantity)
                }
        )
        binding.recyclerSelectedProducts.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerSelectedProducts.adapter = selectedProductAdapter
    }

    private fun setupObservers() {
        userViewModel.users.observe(viewLifecycleOwner) { users ->
            val userSuggestions = users.map {
                "#${it.id} - ${it.username} (${it.email})"
            }
            val adapter = ArrayAdapter(
                    requireContext(),
                    android.R.layout.simple_dropdown_item_1line,
                    userSuggestions
            )
            binding.autoCompleteUser.setAdapter(adapter)
        }

        productViewModel.products.observe(viewLifecycleOwner) { products ->
            if (products.isNotEmpty()) {
                binding.recyclerProducts.visibility = View.VISIBLE
                productSearchAdapter.submitList(products)
                Log.d("OrderFormFragment", "Found ${products.size} products")
            } else {
                binding.recyclerProducts.visibility = View.GONE
                productSearchAdapter.submitList(emptyList())
            }
        }

        productViewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            if (isLoading) {
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        }

        productViewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let {
                Toast.makeText(requireContext(), it, Toast.LENGTH_SHORT).show()
                productViewModel.clearError()
            }
        }

        orderViewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        orderViewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let {
                Toast.makeText(requireContext(), it, Toast.LENGTH_SHORT).show()
                orderViewModel.clearError()
            }
        }

        orderViewModel.orderDetail.observe(viewLifecycleOwner) { order ->
            order?.let {
                populateForm(it)
            }
        }
    }

    private fun loadUsers() {
        userViewModel.loadUsers()
    }

    private fun loadOrderData() {
        if (orderId > 0) {
            orderViewModel.getOrderDetail(orderId)
        }
    }

    private fun searchProducts() {
        val searchText = binding.edtSearchProduct.text.toString().trim()

        if (searchText.isNotEmpty()) {
            productViewModel.searchProducts(searchText)
            binding.recyclerProducts.visibility = View.VISIBLE
        } else {
            binding.recyclerProducts.visibility = View.GONE
            productSearchAdapter.submitList(emptyList())
        }
    }

    private fun displaySelectedUser(user: com.example.admin.model.UserModel) {
        // Nếu có cardSelectedUser trong layout thì mở comment này
        // binding.cardSelectedUser.visibility = View.VISIBLE
        // binding.tvSelectedUserInfo.text = "Khách hàng: ${user.username}"
        // binding.tvSelectedUserEmail.text = "Email: ${user.email}"

        // Tạm thời hiển thị toast
        Toast.makeText(requireContext(), "Đã chọn: ${user.username}", Toast.LENGTH_SHORT).show()
    }

    private fun showQuantityDialog(product: Product) {
        val dialogView = LayoutInflater.from(requireContext()).inflate(R.layout.dialog_quantity, null)
        val edtQuantity = dialogView.findViewById<android.widget.EditText>(R.id.edtQuantity)

        MaterialAlertDialogBuilder(requireContext())
                .setTitle("Chọn số lượng")
                .setMessage("Sản phẩm: ${product.name}\nGiá: ${formatPrice(product.price.toInt())}")
                .setView(dialogView)
                .setPositiveButton("Thêm") { dialog, _ ->
                    val quantityText = edtQuantity.text.toString().trim()
                    val quantity = quantityText.toIntOrNull() ?: 1

                    if (quantity > 0) {
                        addProductToOrder(product, quantity)
                    } else {
                        Toast.makeText(requireContext(), "Số lượng phải lớn hơn 0", Toast.LENGTH_SHORT).show()
                    }
                    dialog.dismiss()
                }
                .setNegativeButton("Hủy", null)
                .show()
    }

    private fun addProductToOrder(product: Product, quantity: Int) {
        // Kiểm tra xem sản phẩm đã có chưa
        val existingIndex = selectedProducts.indexOfFirst { it.productId == product.id }

        if (existingIndex >= 0) {
            // Cập nhật số lượng nếu đã có
            val existingProduct = selectedProducts[existingIndex]
            selectedProducts[existingIndex] = existingProduct.copy(
                    quantity = existingProduct.quantity + quantity
            )
        } else {
            // Thêm mới
            selectedProducts.add(
                    com.example.admin.dto.CreateOrderItemRequest(
                            productId = product.id,
                            quantity = quantity,
                            price = product.price.toInt()
                    )
            )
        }

        updateSelectedProductsUI()
        Toast.makeText(requireContext(), "Đã thêm ${product.name}", Toast.LENGTH_SHORT).show()
    }

    private fun removeProduct(productId: Int) {
        selectedProducts.removeAll { it.productId == productId }
        updateSelectedProductsUI()
    }

    private fun updateProductQuantity(productId: Int, newQuantity: Int) {
        val index = selectedProducts.indexOfFirst { it.productId == productId }
        if (index >= 0 && newQuantity > 0) {
            selectedProducts[index] = selectedProducts[index].copy(quantity = newQuantity)
            updateSelectedProductsUI()
        } else if (newQuantity <= 0) {
            removeProduct(productId)
        }
    }

    private fun updateSelectedProductsUI() {
        // Convert to display items
        val displayItems = selectedProducts.map {
            SelectedProductAdapter.SelectedProductItem(
                    id = it.productId,
                    name = "Sản phẩm #${it.productId}",
                    price = it.price,
                    quantity = it.quantity,
                    total = it.price * it.quantity
            )
        }

        selectedProductAdapter.submitList(displayItems)
        updateOrderSummary()

        // Hiển thị/ẩn thông báo không có sản phẩm
        if (selectedProducts.isEmpty()) {
            binding.tvNoProducts.visibility = View.VISIBLE
            binding.recyclerSelectedProducts.visibility = View.GONE
        } else {
            binding.tvNoProducts.visibility = View.GONE
            binding.recyclerSelectedProducts.visibility = View.VISIBLE
        }
    }

    private fun updateOrderSummary() {
        val totalItems = selectedProducts.sumOf { it.quantity }
        val totalPrice = selectedProducts.sumOf { it.price * it.quantity }

        binding.tvTotalItems.text = totalItems.toString()
        binding.tvTotalPrice.text = "${formatPrice(totalPrice)} đ"
    }

    private fun populateForm(order: com.example.admin.model.OrderModel) {
        try {
            // Hiển thị thông tin khách hàng
            if (order.userId != null) {
                userViewModel.users.value?.find { it.id == order.userId }?.let { user ->
                    selectedUserId = user.id
                    binding.autoCompleteUser.setText("#${user.id} - ${user.username} (${user.email})", false)
                }
            }

            // Hiển thị trạng thái
            val validStatuses = listOf("PENDING", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELED", "ON_HOLD")
            val displayStatus = if (order.status in validStatuses) {
                order.status
            } else {
                "PENDING" // Fallback
            }
            binding.autoCompleteStatus.setText(displayStatus, false)
//            binding.autoCompleteStatus.setText(validStatuses, false)
            // Hiển thị sản phẩm đã chọn
            selectedProducts.clear()
            selectedProducts.addAll(order.items.mapNotNull {
                val productId = it.productId ?: return@mapNotNull null
                val price = it.price ?: return@mapNotNull null

                com.example.admin.dto.CreateOrderItemRequest(
                        productId = productId,
                        quantity = it.quantity,
                        price = price
                )
            })

            updateSelectedProductsUI()

        } catch (e: Exception) {
            Log.e("OrderFormFragment", "Error populating form", e)
            Toast.makeText(requireContext(), "Lỗi hiển thị thông tin đơn hàng", Toast.LENGTH_SHORT).show()
        }
    }

    private fun saveOrder() {
        // 1. Validate user
        val userId = selectedUserId ?: run {
            Toast.makeText(requireContext(), "Vui lòng chọn khách hàng", Toast.LENGTH_SHORT).show()
            return
        }

        // 2. Validate products
        if (selectedProducts.isEmpty()) {
            Toast.makeText(requireContext(), "Vui lòng thêm ít nhất 1 sản phẩm", Toast.LENGTH_SHORT).show()
            return
        }

        // 3. Validate mỗi sản phẩm có giá hợp lệ
//        val invalidProducts = selectedProducts.filter { it.price <= 0 }
//        if (invalidProducts.isNotEmpty()) {
//            // Hiển thị chi tiết sản phẩm lỗi
//            val productNames = invalidProducts.mapNotNull { item ->
//                getProductById(item.productId)?.name ?: "Sản phẩm #${item.productId}"
//            }
//
//            Toast.makeText(
//                    requireContext(),
//                    "Lỗi: ${invalidProducts.size} sản phẩm có giá không hợp lệ:\n${productNames.joinToString("\n")}",
//                    Toast.LENGTH_LONG
//            ).show()
//            return
//        }

        // 4. Calculate total price
        val totalPrice = selectedProducts.sumOf { it.price * it.quantity }
        if (totalPrice <= 0) {
            Toast.makeText(requireContext(), "Tổng tiền đơn hàng phải lớn hơn 0", Toast.LENGTH_SHORT).show()
            return
        }

        // 5. Validate status
        val status = binding.autoCompleteStatus.text.toString().trim()
        if (status.isEmpty()) {
            Toast.makeText(requireContext(), "Vui lòng chọn trạng thái", Toast.LENGTH_SHORT).show()
            return
        }

        Log.d("OrderFormFragment", "Saving order with ${selectedProducts.size} items")
        Log.d("OrderFormFragment", "Items details: ${selectedProducts.joinToString {
            "productId=${it.productId}, price=${it.price}, qty=${it.quantity}"
        }}")

        // Save order
        if (orderId > 0) {
            orderViewModel.updateOrder(
                    id = orderId,
                    userId = userId,
                    price = totalPrice,
                    status = status,
                    items = selectedProducts
            )
        } else {
            orderViewModel.createOrder(
                    userId = userId,
                    price = totalPrice,
                    status = status,
                    items = selectedProducts
            )
        }

        // Theo dõi kết quả
        orderViewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let {
                Log.e("OrderFormFragment", "Save error: $it")
            }
        }

        orderViewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            if (!isLoading) {
                // Khi không còn loading, check xem có lỗi không
                if (orderViewModel.error.value == null) {
                    Toast.makeText(requireContext(), "Lưu đơn hàng thành công", Toast.LENGTH_SHORT).show()
                    Handler(Looper.getMainLooper()).postDelayed({
                        findNavController().navigateUp()
                    }, 1000)
                }
            }
        }
    }

    private fun formatPrice(price: Int): String {
        return String.format("%,d đ", price)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}