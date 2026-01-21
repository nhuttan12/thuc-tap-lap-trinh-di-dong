/**
 * @description Dashboard activity for displaying data from view model
 * @author @nhuttan12
 * @since 2025-08-25
 * @modifies 2025-08-27
 * @modifies 2025-08-28
 * @modifies 2025-08-29
 * @modifies 2025-12-15
 * @version 1.0.4
 */

package com.example.e_commerce.Activity

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.inputmethod.EditorInfo
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.CompositePageTransformer
import androidx.viewpager2.widget.MarginPageTransformer
import androidx.viewpager2.widget.ViewPager2
import com.example.e_commerce.Adapter.BrandsAdapter
import com.example.e_commerce.Adapter.ProductAdapter
import com.example.e_commerce.Adapter.SliderAdapter
import com.example.e_commerce.Helper.CheckToken
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Model.Enum.ProductListType
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.Model.SliderModel
import com.example.e_commerce.ViewModel.BannerViewModel
import com.example.e_commerce.ViewModel.BannerViewModelFactory
import com.example.e_commerce.ViewModel.BrandViewModel
import com.example.e_commerce.ViewModel.BrandViewModelFactory
import com.example.e_commerce.ViewModel.ProductViewModel
import com.example.e_commerce.ViewModel.ProductViewModelFactory
import com.example.e_commerce.ViewModel.WishlistViewModel
import com.example.e_commerce.ViewModel.WishlistViewModelFactory
import com.example.e_commerce.databinding.ActivityMainBinding
import kotlin.math.abs
import kotlin.math.min

class HomeActivity : AppCompatActivity() {
    private val TAG = "HomeActivity"
    private lateinit var tinyDB: TinyDB

    private val productViewModel: ProductViewModel by lazy {
        val factory = ProductViewModelFactory(tinyDB)
        ViewModelProvider(this, factory)[ProductViewModel::class.java]
    }

    private val brandViewModel: BrandViewModel by lazy {
        val factory = BrandViewModelFactory()
        ViewModelProvider(this, factory)[BrandViewModel::class.java]
    }

    private val bannerViewModel: BannerViewModel by lazy {
        val factory = BannerViewModelFactory()
        ViewModelProvider(this, factory)[BannerViewModel::class.java]
    }

    private val wishlistViewModel: WishlistViewModel by lazy {
        val factory = WishlistViewModelFactory(tinyDB)
        ViewModelProvider(this, factory)[WishlistViewModel::class.java]
    }

    private lateinit var checkToken: CheckToken
    private lateinit var productAdapter: ProductAdapter

    private lateinit var binding: ActivityMainBinding

    private val brandsAdapter = BrandsAdapter(items = mutableListOf())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tinyDB = TinyDB(applicationContext)
        checkToken = CheckToken(tinyDB)

        productAdapter =
            ProductAdapter(
                activity = this,
                items = mutableListOf(),
                checkToken = checkToken,
                listType = ProductListType.PRODUCT,
                onItemClick = { product ->
                    loadProductDetailAndNavigate(product.id)
                },
                onWishlistClick = { product ->
                    checkToken.checkTokenOrRedirect(this) {
                        toggleWishlist(product)
                    }
                }
            )

        initUI()
    }

    override fun onResume() {
        super.onResume()

        wishlistViewModel.loadWishlistIds()

        binding.cartBtn.isEnabled = true
        binding.wishlistBtn.isEnabled = true
        binding.homeBtn.isEnabled = true
    }

    private fun initUI() {
        initBrands()
        initRecommendation()
        initBanner()
        initBottomNavigation()
        observeSearch()
        observeWishlist()
    }

    private fun initBottomNavigation() = with(binding) {
        homeBtn.setOnClickListener { }

        cartBtn.setOnClickListener {
            cartBtn.isEnabled = false
            checkToken.checkTokenOrRedirect(this@HomeActivity, onTokenValid = {
                val intent: Intent = Intent(this@HomeActivity, CartActivity::class.java)
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                startActivity(intent)
            })
        }

        profileBtn.setOnClickListener {
            profileBtn.isEnabled = false
            checkToken.checkTokenOrRedirect(this@HomeActivity) {
                val intent = Intent(this@HomeActivity, ProfileActivity::class.java)
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                startActivity(intent)
                profileBtn.isEnabled = true
            }
        }

        wishlistBtn.setOnClickListener {
            wishlistBtn.isEnabled = false
            checkToken.checkTokenOrRedirect(this@HomeActivity, onTokenValid = {
                val intent: Intent = Intent(this@HomeActivity, ProductListActivity::class.java)
                intent.putExtra("TYPE", ProductListType.WISHLIST.name)
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                startActivity(intent)
            })
        }
    }

    private fun initRecommendation() {
        binding.recyclerViewRecommendation.layoutManager = GridLayoutManager(this, 2)
        binding.recyclerViewRecommendation.adapter = productAdapter
        binding.progressBarRecommendation.visibility = View.VISIBLE

        binding.allProdcts.setOnClickListener {
            val intent: Intent = Intent(this@HomeActivity, ProductListActivity::class.java)
            intent.putExtra("TYPE", ProductListType.PRODUCT.name)
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            startActivity(intent)
        }

        productViewModel.products.observe(this) {
            binding.progressBarRecommendation.visibility = View.GONE
            productAdapter.updateDate(it)
        }

        productViewModel.productLoading.observe(this) { isLoading ->
            if (isLoading) {
                Toast.makeText(this, "Đang hiển thị danh sách sản phẩm", Toast.LENGTH_SHORT)
                    .show()
            }
        }

        productViewModel.loadProductList(limit = 10, page = 1)
    }

    private fun initBrands() {
        /**
         * Binding to recyclerViewBrands in activity_main.xml
         */
        binding.recyclerViewBrands.layoutManager =
            LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)

        /**
         * Binding to adapter for loading data
         */
        binding.recyclerViewBrands.adapter = brandsAdapter

        /**
         * Change visibility of progress bar to true when loading data from view model
         */
        brandViewModel.loading.observe(this) { isLoading ->
            binding.progressBarBrands.visibility = if (isLoading) View.VISIBLE else View.GONE

            /**
             * Show text 'Loading brands...'
             */
            if (isLoading) {
                Toast.makeText(this, "Đang hiển thị thương hiệu sản phẩm", Toast.LENGTH_SHORT)
                    .show()
            }
        }

        /**
         * Observing the data from view model
         */
        brandViewModel.brands.observe(this) { data ->
            brandsAdapter.updateData(data)
        }

        /**
         * Show error message whether if error occurs when loading data from view model
         */
        brandViewModel.error.observe(this) { message ->
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
        }

        /**
         * Call load brands from view model
         */
        brandViewModel.loadBrands(limit = 10)
    }

    private fun setUpBanners(imageList: List<SliderModel>) {
        if (imageList.isEmpty()) return

        val useInfinite = imageList.size >= 3
        val displayList = if (useInfinite) buildInfiniteList(imageList) else imageList

        binding.viewPagerSlider.apply {
            adapter = SliderAdapter(displayList, this)
            clipToPadding = false
            clipChildren = false
            offscreenPageLimit = min(3, displayList.size)

            (getChildAt(0) as? RecyclerView)?.overScrollMode = RecyclerView.OVER_SCROLL_NEVER

            setPageTransformer(
                CompositePageTransformer().apply {
                    addTransformer(MarginPageTransformer(16))
                    addTransformer { page, position ->
                        val scale = 0.85f + (1 - abs(position)) * 0.15f
                        page.scaleY = scale
                    }
                }
            )

            if (useInfinite) {
                setCurrentItem(1, false)

                registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
                    override fun onPageSelected(position: Int) {
                        val lastPosition = displayList.size - 1
                        when (position) {
                            0 -> setCurrentItem(lastPosition - 1, false)
                            lastPosition -> setCurrentItem(1, false)
                        }
                    }
                })
            }
        }

        // Dot indicator
        binding.dotIndicator.apply {
            visibility = if (imageList.size > 1) View.VISIBLE else View.GONE
            if (imageList.size > 1) attachTo(binding.viewPagerSlider)
        }
    }

    private fun initBanner() {
        binding.progressBarBanner.visibility = View.VISIBLE
        bannerViewModel.banners.observe(this) { items ->
            setUpBanners(items)
            binding.progressBarBanner.visibility = View.GONE
        }

        bannerViewModel.loadBanners()
    }

    private fun buildInfiniteList(data: List<SliderModel>): List<SliderModel> {
        if (data.size <= 1) return data

        val list = mutableListOf<SliderModel>()
        list.add(data.last())
        list.addAll(data)
        list.add(data.first())

        return list
    }

    private fun loadProductDetailAndNavigate(productID: Int) {
        val intent = Intent(this, DetailActivity::class.java)
        intent.putExtra(DetailActivity.EXTRA_PRODUCT_ID, productID)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        startActivity(intent)
    }

    private fun toggleWishlist(product: ProductModel) {
        checkToken.checkTokenOrRedirect(this@HomeActivity, onTokenValid = {
            if (product.isInWishlist) {
                wishlistViewModel.removeProductFromWishlist(product.id)
                Log.d(TAG, "Remove product from wishlist: ${product.id}")
            } else {
                wishlistViewModel.addProductToWishlist(product.id)
                Log.d(TAG, "Add product to wishlist: ${product.id}")
            }
        })
    }

    private fun observeWishlist() {
        wishlistViewModel.wishlistIds.observe(this) { ids ->
            val updated = productAdapter.currentItems().map {
                it.copy(isInWishlist = ids.contains(it.id))
            }
            productAdapter.updateDate(updated)
        }
    }

    private fun observeSearch() {
        binding.editTextText.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                val keyword = binding.editTextText.text.toString().trim()

                if (keyword.isNotEmpty()) {
                    val intent: Intent = Intent(this@HomeActivity, ProductListActivity::class.java)
                    intent.putExtra("TYPE", ProductListType.SEARCH.name)
                    intent.putExtra("SEARCH_QUERY", keyword)
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                    startActivity(intent)
                }
                true
            } else {
                false
            }
        }
    }
}