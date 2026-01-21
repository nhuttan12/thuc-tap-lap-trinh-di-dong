/**
 * @description Product list activity loading data to recycler view
 * @author @nhuttan12
 * @since 2026-01-10
 * @modifies 2026-01-12
 * @version 1.0.1
 */

package com.example.e_commerce.Activity

import android.content.Intent
import android.content.res.Resources
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.e_commerce.Adapter.PaginationAdapter
import com.example.e_commerce.Adapter.ProductAdapter
import com.example.e_commerce.Helper.CenterItemDecoration
import com.example.e_commerce.Helper.CheckToken
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Mappers.PagingMapper
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
    private lateinit var searchQuery: String
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

    private lateinit var productAdapter: ProductAdapter
    private lateinit var paginationAdapter: PaginationAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()
        binding = ActivityProductListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tinyDB = TinyDB(applicationContext)
        checkToken = CheckToken(tinyDB)

        type = ProductListType.valueOf(
            intent.getStringExtra("TYPE") ?: ProductListType.PRODUCT.name
        )

        searchQuery = intent.getStringExtra("SEARCH_QUERY") ?: ""

        initUI()
    }

    override fun onResume() {
        super.onResume()
        wishlistViewModel.loadWishlistIds()

//        binding.cartBtn.isEnabled = true
//        binding.wishlistBtn.isEnabled = true
//        binding.homeBtn.isEnabled = true
    }

    private fun initUI() {
        wishlistViewModel.loadWishlistIds()

        initProductList()
//        initBottomNavigation()
        observeData()
        observeWishlist()
        loadData(page = 1)

        binding.backBtn.setOnClickListener { finish() }
    }

    private fun initProductList() {
        productAdapter = ProductAdapter(
            activity = this,
            items = mutableListOf(),
            checkToken = checkToken,
            listType = type,
            onItemClick = {
                loadProductDetailAndNavigate(it.id)
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


        paginationAdapter = PaginationAdapter { page ->
            val current = productViewModel.pagingMeta.value?.page ?: 1

            val targetPage = when (page) {
                -1 -> current - 1
                -2 -> current + 1
                else -> page
            }

            loadData(page = targetPage)
        }

//        val concatAdapter = ConcatAdapter(
//            ConcatAdapter.Config.Builder().setIsolateViewTypes(false).build(),
//            productAdapter,
//            paginationAdapter
//        )

//        binding.recyclerViewProductList.layoutManager = GridLayoutManager(this@ProductListActivity, 2).apply {
//            spanSizeLookup = object : GridLayoutManager.SpanSizeLookup() {
//                override fun getSpanSize(position: Int): Int {
//                    return when {
//                        position < productAdapter.itemCount -> 1
//                        else -> 2
//                    }
//                }
//            }
//        }

//        binding.recyclerViewProductList.adapter = concatAdapter
        binding.recyclerViewProductList.apply {
            layoutManager = GridLayoutManager(this@ProductListActivity, 2)
            adapter = productAdapter
        }

        binding.recyclerViewPagination.apply {
            layoutManager = LinearLayoutManager(
                this@ProductListActivity,
                LinearLayoutManager.HORIZONTAL,
                false
            )
            adapter = paginationAdapter
        }

        val screenWidth = Resources.getSystem().displayMetrics.widthPixels

        binding.recyclerViewPagination.addItemDecoration(
            CenterItemDecoration(itemWidth = screenWidth)
        )

        binding.progressBarProductList.visibility = View.VISIBLE
    }

    private fun loadProductDetailAndNavigate(productID: Int) {
        val intent = Intent(this, DetailActivity::class.java)
        intent.putExtra(DetailActivity.EXTRA_PRODUCT_ID, productID)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        startActivity(intent)
    }

//    private fun initBottomNavigation() = with(binding) {
//        homeBtn.setOnClickListener {
//            homeBtn.isEnabled = false
//            val intent: Intent = Intent(this@ProductListActivity, HomeActivity::class.java)
//            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
//            startActivity(intent)
//        }
//
//        cartBtn.setOnClickListener {
//            cartBtn.isEnabled = false
//            checkToken.checkTokenOrRedirect(this@ProductListActivity, {
//                val intent: Intent = Intent(this@ProductListActivity, CartActivity::class.java)
//                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
//                startActivity(intent)
//            })
//        }
//
//        wishlistBtn.setOnClickListener { }
//    }

    private fun toggleWishlist(product: ProductModel) {
        if (product.isInWishlist) {
            wishlistViewModel.removeProductFromWishlist(productID = product.id)
            Log.d(TAG, "Remove product from wishlist with productID: $product.id")

            if (type == ProductListType.WISHLIST) {
                wishlistViewModel.loadWishlist(
                    page = productViewModel.pagingMeta.value?.page ?: 1,
                    limit = 10
                )
            }
        } else {
            wishlistViewModel.addProductToWishlist(productID = product.id)
            Log.d(TAG, "Add product to wishlist with productID: $product.id")
        }
    }

    private fun observeWishlist() {
        wishlistViewModel.wishlistIds.observe(this) { ids ->
            val updated = productAdapter.currentItems().map {
                it.copy(isInWishlist = ids.contains(it.id))
            }

            productAdapter.updateDate(updated)
        }
    }

    private fun loadData(page: Int) {
        when (type) {
            ProductListType.PRODUCT -> {
                productViewModel.loadProductList(
                    limit = 10,
                    page = page
                )
            }

            ProductListType.SEARCH -> {
                productViewModel.loadProductListByName(
                    limit = 10,
                    page = page,
                    productName = searchQuery
                )
            }

            ProductListType.WISHLIST -> {
                wishlistViewModel.loadWishlist(page = page, limit = 10)
            }
        }
    }

    private fun observeData() {
        productViewModel.products.observe(this) {
            if (type == ProductListType.PRODUCT) {
                productAdapter.updateDate(it)
                binding.progressBarProductList.visibility = View.GONE
            }
        }

        productViewModel.productsByName.observe(this) {
            if (type == ProductListType.SEARCH) {
                productAdapter.updateDate(it)
                binding.progressBarProductList.visibility = View.GONE
            }
        }

        wishlistViewModel.wishlistItem.observe(this) {
            if (type == ProductListType.WISHLIST) {
                val fixedList = it.map { product ->
                    product.copy(isInWishlist = true)
                }
                productAdapter.updateDate(fixedList)
                binding.progressBarProductList.visibility = View.GONE
            }
        }

        productViewModel.pagingMeta.observe(this) {
            paginationAdapter.submit(
                PagingMapper.toPageItem(it)
            )
        }
    }
}