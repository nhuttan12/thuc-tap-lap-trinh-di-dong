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
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.e_commerce.Adapter.PaginationAdapter
import com.example.e_commerce.Adapter.PopularAdapter
import com.example.e_commerce.Helper.CheckToken
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Model.Enum.ProductListType
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.ViewModel.ProductViewModel
import com.example.e_commerce.ViewModel.ProductViewModelFactory
import com.example.e_commerce.ViewModel.WishlistViewModel
import com.example.e_commerce.ViewModel.WishlistViewModelFactory
import com.example.e_commerce.databinding.ActivityProductListBinding

class ProductListActivity : AppCompatActivity() {
    private val TAG = "ProductListActivity"
    private lateinit var tinyDB: TinyDB
    private lateinit var checkToken: CheckToken
    private lateinit var type: ProductListType
    private var productList: List<ProductModel> = emptyList()

    private val productViewModel: ProductViewModel by lazy {
        val factory = ProductViewModelFactory(tinyDB)
        ViewModelProvider(this, factory)[ProductViewModel::class.java]
    }

    private val wishlistViewModel: WishlistViewModel by lazy {
        val factory = WishlistViewModelFactory(tinyDB)
        ViewModelProvider(this, factory)[WishlistViewModel::class.java]
    }

    private lateinit var binding: ActivityProductListBinding

    private lateinit var popularAdapter: PopularAdapter
    private lateinit var paginationAdapter: PaginationAdapter

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
        observeWishlist()
    }

    override fun onResume() {
        super.onResume()

        binding.cartBtn.isEnabled = true
        binding.wishlistBtn.isEnabled = true
        binding.homeBtn.isEnabled = true
    }

    private fun initUI() {
        initProductList()
        initBottomNavigation()
        initPagination()

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
                productViewModel.popular.observe(this) {
                    popularAdapter.updateDate(it)
                    paginationAdapter.update(totalPages = 10, currentPage = productViewModel.currentPage)
                    binding.progressBarProductList.visibility = View.GONE
                }

                productViewModel.loadPopular(limit = 10, page = 1)
            }

            ProductListType.WISHLIST -> {
                wishlistViewModel.wishlistItem.observe(this) { items ->
                    productList = items

                    wishlistViewModel.loadWishlistIds()

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

    private fun initPagination() {
        binding.recyclerViewPagination.layoutManager = LinearLayoutManager(this,
            LinearLayoutManager.HORIZONTAL, false)

        val paginationAdapter = PaginationAdapter(totalPages = 10, currentPage = 1) { page ->
            productViewModel.loadPopular(limit = 10, page = page)
        }

        binding.recyclerViewPagination.adapter = paginationAdapter
    }

    private fun loadProductDetailAndNavigate(productID: Int) {
        val intent = Intent(this, DetailActivity::class.java)
        intent.putExtra(DetailActivity.EXTRA_PRODUCT_ID, productID)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        startActivity(intent)
    }

    private fun initBottomNavigation() = with(binding) {
        homeBtn.setOnClickListener {
            homeBtn.isEnabled = false
            val intent: Intent = Intent(this@ProductListActivity, HomeActivity::class.java)
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            startActivity(intent)
        }

        cartBtn.setOnClickListener {
            cartBtn.isEnabled = false
            checkToken.checkTokenOrRedirect(this@ProductListActivity, {
                val intent: Intent = Intent(this@ProductListActivity, CartActivity::class.java)
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                startActivity(intent)
            })
        }

        wishlistBtn.setOnClickListener { }
    }

    private fun toggleWishlist(product: ProductModel) {
        if (product.isInWishlist) {
            wishlistViewModel.removeProductFromWishlist(productID = product.id)
            Log.d(TAG, "Remove product from wishlist with productID: $product.id")
        } else {
            wishlistViewModel.addProductToWishlist(productID = product.id)
            Log.d(TAG, "Add product to wishlist with productID: $product.id")
        }
    }

    private fun observeWishlist() {
        wishlistViewModel.wishlistIds.observe(this) { ids ->
            if (type == ProductListType.WISHLIST) {
                val updated =
                    productList
                        .filter { ids.contains(it.id) }
                        .map { it.copy(isInWishlist = true) }

                popularAdapter.updateDate(updated)
            }
        }
    }
}