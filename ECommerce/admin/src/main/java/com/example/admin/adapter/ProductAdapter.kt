package com.example.admin.adapter//package com.example.admin.
//
//import android.os.Bundle
//import android.view.LayoutInflater
//import android.view.View
//import android.view.ViewGroup
//import androidx.fragment.app.Fragment
//import androidx.recyclerview.widget.LinearLayoutManager
////import com.example.admin.adapter.
//import com.example.admin.databinding.FragmentProductListBinding
//import com.example.admin.model.ProductModel
//
//class ProductListFragment : Fragment() {
//
//    // 1. Khai báo Binding
//    private var _binding: FragmentProductListBinding? = null
//    private val binding get() = _binding!!
//
//    // Dữ liệu giả định để hiển thị
//    private val dummyProducts = listOf(
//            ProductModel(id = "1", name = "Áo Thun Unisex", price = 150000.0, description = "Áo thun cotton"),
//            ProductModel(id = "2", name = "Quần Jeans Slim Fit", price = 450000.0, description = "Quần jeans xanh"),
//            ProductModel(id = "3", name = "Giày Thể Thao Pro", price = 899000.0, description = "Giày chạy bộ"),
//    )
//
//    override fun onCreateView(
//            inflater: LayoutInflater, container: ViewGroup?,
//            savedInstanceState: Bundle?
//    ): View {
//        // 2. Khởi tạo Binding
//        _binding = FragmentProductListBinding.inflate(inflater, container, false)
//        return binding.root
//    }
//
//    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
//        super.onViewCreated(view, savedInstanceState)
//
//        setupRecyclerView()
//        setupListeners()
//    }
//
//    private fun setupRecyclerView() {
//        // 3. Khởi tạo Adapter và gán cho RecyclerView
//        val productAdapter = ProductAdapter(
//                products = dummyProducts, // Sử dụng dữ liệu giả định
//                onEdit = { product ->
//                    // TODO: Xử lý khi click vào nút Edit (Điều hướng đến ProductDetailFragment)
//                    // Ví dụ: findNavController().navigate(R.id.action_list_to_detail, bundleOf("product" to product))
//                    showToast("Chỉnh sửa: ${product.name}")
//                },
//                onDelete = { product ->
//                    // TODO: Xử lý khi click vào nút Delete (Gọi API/DB để xóa)
//                    showToast("Xóa: ${product.name}")
//                }
//        )
//
//        binding.productsRecyclerView.apply {
//            adapter = productAdapter
//            layoutManager = LinearLayoutManager(context)
//        }
//    }
//
//    private fun setupListeners() {
//        // Xử lý click nút Thêm mới
//        binding.addProductFab.setOnClickListener {
//            // TODO: Điều hướng đến ProductDetailFragment (chế độ Thêm mới)
//            showToast("Mở màn hình Thêm mới")
//        }
//    }
//
//    // Hàm tiện ích để hiển thị Toast
//    private fun showToast(message: String) {
//
//        println(message)
//    }
//
//
//    override fun onDestroyView() {
//        super.onDestroyView()
//        // 4. Giải phóng Binding
//        _binding = null
//    }
//}