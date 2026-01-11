/**
 * @description Product list activity loading data to recycler view
 * @author @nhuttan12
 * @since 2026-01-10
 * @version 1.0.0
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
import com.example.e_commerce.Adapter.PopularAdapter
import com.example.e_commerce.Helper.CheckToken
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Model.Enum.ProductListType
import com.example.e_commerce.ViewModel.MainViewModel
import com.example.e_commerce.ViewModel.MainViewModelFactory
import com.example.e_commerce.databinding.ActivityProductListBinding

class ProductListActivity : AppCompatActivity() {
    private val tinyDB: TinyDB by lazy { TinyDB(this) }
    private lateinit var type: ProductListType

    private val viewModel: MainViewModel by lazy {
        val factory = MainViewModelFactory(tinyDB)
        ViewModelProvider(this, factory)[MainViewModel::class.java]
    }
    private lateinit var binding: ActivityProductListBinding
    private val checkToken: CheckToken by lazy { CheckToken(tinyDB) }
    private val popularAdapter = PopularAdapter(mutableListOf()) { product ->
        loadProductDetailAndNavigate(product.id)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()
        binding = ActivityProductListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        type = ProductListType.valueOf(
            intent.getStringExtra("TYPE") ?: ProductListType.POPULAR.name
        )

        initUI()
        observeProductDetail()
    }

    private fun initUI() {
        initProductList()
        initBottomNavigation()

        binding.backBtn.setOnClickListener { finish() }
    }

    private fun initProductList() {
        binding.recyclerViewProductList.layoutManager = GridLayoutManager(this, 2)
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
                viewModel.wishlistItem.observe(this) {
                    popularAdapter.updateDate(it)
                    binding.progressBarProductList.visibility = View.GONE
                }

                viewModel.loadWishlist(page = 1, limit = 10)
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
        cartBtn.setOnClickListener {
            cartBtn.isEnabled = false
            startActivity(
                Intent(this@ProductListActivity, DashboardActivity::class.java)
            )
            homeBtn.isEnabled = true
        }
        cartBtn.setOnClickListener {
            cartBtn.isEnabled = false
            checkToken.checkTokenOrRedirect(this@ProductListActivity, {
                startActivity(
                    Intent(this@ProductListActivity, CartActivity::class.java)
                )
                cartBtn.isEnabled = true
            })
        }
    }
}