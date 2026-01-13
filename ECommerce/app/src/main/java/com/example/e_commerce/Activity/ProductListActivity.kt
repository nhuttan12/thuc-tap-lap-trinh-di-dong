/**
 * @description Product list activity loading data to recycler view
 * @author @nhuttan12
 * @since 2026-01-10
 * @modifies 2026-01-12
 * @version 1.0.1
 */

package com.example.e_commerce.Activity

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import com.example.e_commerce.Adapter.PopularAdapter
import com.example.e_commerce.Helper.CheckToken
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Model.Enum.ProductListType
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.ViewModel.MainViewModel
import com.example.e_commerce.ViewModel.MainViewModelFactory
import com.example.e_commerce.ViewModel.WishlistViewModel
import com.example.e_commerce.ViewModel.WishlistViewModelFactory
import com.example.e_commerce.databinding.ActivityProductListBinding

class ProductListActivity : AppCompatActivity() {
    private val TAG = "ProductListActivity"
    private lateinit var tinyDB: TinyDB
    private lateinit var checkToken: CheckToken
    private lateinit var type: ProductListType
    private var productList: List<ProductModel> = emptyList()
    private var pendingWishlistProductID: Int? = null

    private val viewModel: MainViewModel by lazy {
        val factory = MainViewModelFactory(tinyDB)
        ViewModelProvider(this, factory)[MainViewModel::class.java]
    }

    private val wishlistViewModel: WishlistViewModel by lazy {
        val factory = WishlistViewModelFactory(tinyDB)
        ViewModelProvider(this, factory)[WishlistViewModel::class.java]
    }

    private lateinit var binding: ActivityProductListBinding

    private lateinit var popularAdapter: PopularAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()
        binding = ActivityProductListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tinyDB = TinyDB(applicationContext)
        checkToken = CheckToken(tinyDB)

        type = ProductListType.valueOf(
            intent.getStringExtra("TYPE") ?: ProductListType.POPULAR.name
        )

        popularAdapter =
            PopularAdapter(
                activity = this,
                items = mutableListOf(),
                checkToken = checkToken,
                listType = type,
                onItemClick = { product ->
                    loadProductDetailAndNavigate(product.id)
                },
                onWishlistClick = { product ->
                    when (type) {
                        ProductListType.WISHLIST -> {
                            toggleWishlist(product)
                        }

                        else -> {
                            checkToken.checkTokenOrRedirect(this) {
                                toggleWishlist(product)
                            }
                        }
                    }

                }
            )

        initUI()
        observeProductDetail()
        observeWishlist()
    }

    private fun initUI() {
        initProductList()
        initBottomNavigation()

        binding.backBtn.setOnClickListener { finish() }
    }

    private fun initProductList() {
        binding.recyclerViewProductList.layoutManager = GridLayoutManager(this, 2)

        popularAdapter = PopularAdapter(
            activity = this,
            checkToken = checkToken,
            items = mutableListOf(),
            listType = type,
            onItemClick = { productModel ->
                loadProductDetailAndNavigate(productModel.id)
            },
            onWishlistClick = { productModel ->
                toggleWishlist(productModel)
            }
        )

        binding.recyclerViewProductList.adapter = popularAdapter
        binding.progressBarProductList.visibility = View.VISIBLE

        when (type) {
            ProductListType.POPULAR -> {
                viewModel.popular.observe(this) {
                    popularAdapter.updateDate(it)
                    binding.progressBarProductList.visibility = View.GONE
                }

                viewModel.loadPopular()
            }

            ProductListType.WISHLIST -> {
                wishlistViewModel.wishlistItem.observe(this) {
                    val wishlistProducts = it.map {
                        it.copy(isInWishlist = true)
                    }

                    productList = wishlistProducts
                    popularAdapter.updateDate(wishlistProducts)
                    binding.progressBarProductList.visibility = View.GONE
                }

                wishlistViewModel.loadWishlist(page = 1, limit = 10)
            }

            ProductListType.PRODUCT -> {
                TODO("Not yet implemented")
            }

            ProductListType.SEARCH -> {
                TODO("Not yet implemented")
            }
        }
    }

    private fun loadProductDetailAndNavigate(productID: Int) {
        viewModel.loadProductDetail(productID)
    }


    private fun observeProductDetail() {
        viewModel.productDetail.observe(this) { item ->

            val intent = Intent(this, DetailActivity::class.java)
            intent.putExtra("object", item)
            startActivity(intent)
        }

        viewModel.loading.observe(this) { isLoading ->
            if (isLoading) Toast.makeText(this, "Đang tải", Toast.LENGTH_SHORT).show()
        }

        viewModel.error.observe(this) { message ->
            Toast.makeText(this, message ?: "Lỗi không xác định", Toast.LENGTH_SHORT).show()
        }
    }

    private fun initBottomNavigation() = with(binding) {
        homeBtn.setOnClickListener {
            homeBtn.isEnabled = false
            startActivity(
                Intent(this@ProductListActivity, DashboardActivity::class.java)
            )
            finish()
        }

        cartBtn.setOnClickListener {
            cartBtn.isEnabled = false
            checkToken.checkTokenOrRedirect(this@ProductListActivity, {
                startActivity(
                    Intent(this@ProductListActivity, CartActivity::class.java)
                )
                finish()
            })
        }

        wishlistBtn.isEnabled = false
    }

    private fun toggleWishlist(product: ProductModel) {
        pendingWishlistProductID = product.id
        Log.d(TAG, "pendingWishlistProductID: $pendingWishlistProductID")
        Log.d(TAG, "Is in wishlist: ${product.isInWishlist}")

        if (product.isInWishlist) {
            wishlistViewModel.removeProductFromWishlist(productID = product.id)
        } else {
            wishlistViewModel.addProductToWishlist(productID = product.id)
        }
    }

    private fun observeWishlist() {
        wishlistViewModel.addProductToWishlistMsg.observe(this) { success ->
            if (success == true) {
                updateWishlistState(isInWishlist = true)
            } else {
                Log.d(TAG, "Thêm sản phẩm vào danh sách yêu thích thất bại")
                Toast.makeText(
                    this,
                    "Thêm sản phẩm vào danh sách yêu thích thất bại",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }

        wishlistViewModel.removeProductFromWishlistMsg.observe(this) { success ->
            if (success == true && type == ProductListType.WISHLIST) {
                updateWishlistState(isInWishlist = false)
                popularAdapter.removeItemById(productId = pendingWishlistProductID!!)
            } else {
                Log.d(TAG, "Xoá sản phẩm khỏi danh sách yêu thích thất bại")
                Toast.makeText(
                    this,
                    "Xoá sản phẩm khỏi danh sách yêu thích thất bại",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun updateWishlistState(isInWishlist: Boolean) {
        val id = pendingWishlistProductID ?: return

        val updatedList = popularAdapter.currentItems().map {
            if (it.id == id) {
                it.copy(isInWishlist = isInWishlist)
            } else it
        }

        popularAdapter.updateDate(updatedList)
    }
}