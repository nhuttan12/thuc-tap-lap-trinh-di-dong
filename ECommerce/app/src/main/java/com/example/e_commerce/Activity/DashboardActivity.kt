package com.example.e_commerce.Activity

import android.os.Bundle
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.CompositePageTransformer
import androidx.viewpager2.widget.MarginPageTransformer
import com.example.e_commerce.Adapter.BrandsAdapter
import com.example.e_commerce.Adapter.PopularAdapter
import com.example.e_commerce.Adapter.SliderAdapter
import com.example.e_commerce.Model.SliderModel
import com.example.e_commerce.ViewModel.MainViewModel
import com.example.e_commerce.databinding.ActivityMainBinding

class DashboardActivity : AppCompatActivity() {
    private val viewModel: MainViewModel by lazy {
        ViewModelProvider(this)[MainViewModel::class.java]
    }

    private lateinit var binding: ActivityMainBinding

    private val brandsAdapter = BrandsAdapter(mutableListOf())
    private val popularAdapter = PopularAdapter(mutableListOf())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        initUI()
    }

    private fun initUI() {
        initBrands()
        initBanner()
        initRecommended()
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
        binding.recyclerViewBrands.layoutManager =
            LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        binding.recyclerViewBrands.adapter = brandsAdapter
        binding.progressBarBrands.visibility = View.VISIBLE

        viewModel.brands.observe(this) { data ->
            brandsAdapter.updateData(data)
            binding.progressBarBrands.visibility = View.GONE
        }

        viewModel.loadBrands()
    }

    private fun setUpBanners(image: List<SliderModel>) {
        binding.viewPagerSlider.apply {
            adapter = SliderAdapter(image, this)
            clipToPadding = false
            clipChildren = false
            offscreenPageLimit = 3
            (getChildAt(0) as? RecyclerView)?.overScrollMode = RecyclerView.OVER_SCROLL_NEVER
            setPageTransformer(CompositePageTransformer().apply {
                addTransformer(MarginPageTransformer(40))
            })
        }

        binding.dotIndicator.apply {
            visibility = if (image.size > 1) View.VISIBLE else View.GONE
            if (image.size > 1) attachTo(binding.viewPagerSlider)
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
}