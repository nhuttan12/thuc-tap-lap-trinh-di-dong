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
import android.view.View
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
import com.example.e_commerce.Adapter.PopularAdapter
import com.example.e_commerce.Adapter.SliderAdapter
import com.example.e_commerce.Helper.CheckToken
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Model.SliderModel
import com.example.e_commerce.ViewModel.MainViewModel
import com.example.e_commerce.ViewModel.MainViewModelFactory
import com.example.e_commerce.databinding.ActivityMainBinding
import kotlin.math.min

class DashboardActivity : AppCompatActivity() {
//    private val viewModel: MainViewModel by lazy {
//        val tinyDB = TinyDB(this)
//        val factory = MainViewModelFactory(tinyDB)
//
//        ViewModelProvider(this, factory)[MainViewModel::class.java]
//    }

    private lateinit var binding: ActivityMainBinding
    private lateinit var tinyDB: TinyDB
    private lateinit var checkToken: CheckToken
    private lateinit var viewModel: MainViewModel

    private val brandsAdapter = BrandsAdapter(mutableListOf())
    private val popularAdapter = PopularAdapter(mutableListOf()) { product ->
        loadProductDetailAndNavigate(product.id)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tinyDB = TinyDB(this)
        checkToken = CheckToken(tinyDB)
        val factory = MainViewModelFactory(tinyDB)
        viewModel = ViewModelProvider(this, factory)[MainViewModel::class.java]

        initUI()
        observeProductDetail()
    }

    private fun initUI() {
        initBrands()
        initBanner()
        initRecommended()
        initBottomNavigation()
    }

    private fun initBottomNavigation() {
        binding.cartBtn.setOnClickListener {
            checkToken.checkTokenOrRedirect(this@DashboardActivity, {
                startActivity(
                    Intent(this@DashboardActivity, CartActivity::class.java)
                )
            })
        }
    }

    private fun initRecommended() {
        binding.recyclerViewRecommendation.layoutManager = GridLayoutManager(this, 2)
        binding.recyclerViewRecommendation.adapter = popularAdapter
        binding.progressBarRecommendation.visibility = View.VISIBLE

        viewModel.popular.observe(this) { data ->
            popularAdapter.updateDate(data)
            binding.progressBarRecommendation.visibility = View.GONE
        }
        viewModel.loadPopular()
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
         * Observing the data from view model
         */
        viewModel.brands.observe(this) { data ->
            brandsAdapter.updateData(data)
        }

        /**
         * Change visibility of progress bar to true when loading data from view model
         */
        viewModel.loading.observe(this) { isLoading ->
            binding.progressBarBrands.visibility = if (isLoading) View.VISIBLE else View.GONE

            /**
             * Show text 'Loading brands...'
             */
            if (isLoading) {
                Toast.makeText(this, "Đang tải...", Toast.LENGTH_SHORT).show()
            }
        }

        /**
         * Show error message whether if error occurs when loading data from view model
         */
        viewModel.error.observe(this) { message ->
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
        }

        /**
         * Call load brands from view model
         */
        viewModel.loadBrands(limit = 10)
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
                        val scale = 0.85f + (1 - kotlin.math.abs(position)) * 0.15f
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
        viewModel.banners.observe(this) { items ->
            setUpBanners(items)
            binding.progressBarBanner.visibility = View.GONE
        }

        viewModel.loadBanners()
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
}