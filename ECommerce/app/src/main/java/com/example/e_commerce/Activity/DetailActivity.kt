/**
 * @description Detail activity for displaying data from view model
 * @author @nhuttan12
 * @since 2026-01-08
 * @version 1.0.0
 */

package com.example.e_commerce.Activity

import android.graphics.Paint
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.example.e_commerce.Adapter.ColorAdapter
import com.example.e_commerce.Adapter.DescriptionAdapter
import com.example.e_commerce.Adapter.PicsAdapter
import com.example.e_commerce.Adapter.SizeAdapter
import com.example.e_commerce.Helper.CheckToken
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Model.ProductDetailModel
import com.example.e_commerce.ViewModel.CartViewModel
import com.example.e_commerce.ViewModel.CartViewModelFactory
import com.example.e_commerce.ViewModel.ProductViewModel
import com.example.e_commerce.ViewModel.ProductViewModelFactory
import com.example.e_commerce.databinding.ActivityDetailBinding
import java.text.DecimalFormat

class DetailActivity : AppCompatActivity() {
    private val TAG: String = "DetailActivity"

    companion object {
        const val EXTRA_PRODUCT_ID = "PRODUCT_ID"
    }

    private lateinit var binding: ActivityDetailBinding
    private lateinit var item: ProductDetailModel
    private val priceFormat: DecimalFormat = DecimalFormat("#,###.##")

    private val productViewModel: ProductViewModel by lazy {
        val factory = ProductViewModelFactory(tinyDB)
        ViewModelProvider(this, factory)[ProductViewModel::class.java]
    }

    private val cartViewModel: CartViewModel by lazy {
        val factory = CartViewModelFactory(tinyDB)
        ViewModelProvider(this, factory)[CartViewModel::class.java]
    }

    private var productID: Int = -1

    private lateinit var tinyDB: TinyDB
    private lateinit var checkToken: CheckToken

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tinyDB = TinyDB(applicationContext)
        checkToken = CheckToken(tinyDB)

        productID = intent.getIntExtra(EXTRA_PRODUCT_ID, -1)
        if (productID == -1) {
            finish()
            return
        }

        observeProductDetail()
        observeAddToCartResult()
        productViewModel.loadProductDetail(productID = productID)
    }

    private fun setupSizeList() {
        val sizeList = item.size.map { it }
        binding.sizeList.apply {
            adapter = SizeAdapter(sizeList as MutableList<String>)
            layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
        }
    }

    private fun setupColorsList() {
        binding.colorList.adapter = ColorAdapter(item.color)
        binding.colorList.layoutManager =
            LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
    }

    private fun setupPicsList() {
        val picsList = item.picUrl.toList()
        binding.picList.apply {
            adapter = PicsAdapter(picsList as MutableList<String>) { imageUrl ->
                Glide.with(this@DetailActivity).load(imageUrl).into(binding.picMain)
            }
            layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
        }
    }

    private fun setupViews() = with(binding) {
        titleTxt.text = item.title
        descriptionList.apply {
            adapter = DescriptionAdapter(item.description)
            layoutManager = LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false)
        }

        priceTxt.text = priceFormat.format(item.price)
        oldPriceTxt.text = priceFormat.format(item.oldPrice)
        oldPriceTxt.paintFlags = priceTxt.paintFlags or Paint.STRIKE_THRU_TEXT_FLAG

        ratingTxt.text = "${item.rating}"
        numberItemTxt.text = item.numberInCart.toString()

        updateTotalPrice()

        Glide.with(this@DetailActivity)
            .load(item.picUrl.firstOrNull())
            .into(picMain)

        backBtn.setOnClickListener { finish() }

        plusBtn.setOnClickListener {
            item.numberInCart++
            numberItemTxt.text = item.numberInCart.toString()
            updateTotalPrice()
        }

        minusBtn.setOnClickListener {
            if (item.numberInCart > 1) {
                item.numberInCart--
                numberItemTxt.text = item.numberInCart.toString()
                updateTotalPrice()
            }
        }

        addToCartBtn.setOnClickListener {
            checkToken.checkTokenOrRedirect(this@DetailActivity) {
                cartViewModel.addProductToCart(
                    productID = productID,
                    quantity = item.numberInCart
                )
            }
        }
    }

    private fun updateTotalPrice() = with(binding) {
        totalPriceTxt.text = priceFormat.format(item.price * item.numberInCart)
    }

    private fun observeProductDetail() {
        productViewModel.productDetail.observe(this) { product ->
            item = product
            setupViews()
            setupPicsList()
            setupColorsList()
            setupSizeList()
        }

        productViewModel.productDetailLoading.observe(this) { isLoading ->
            if (isLoading) {
                Toast.makeText(this, "Đang hiển thị thông tin sản phẩm", Toast.LENGTH_SHORT).show()
            }
        }

        productViewModel.error.observe(this) { message ->
            Toast.makeText(this, message ?: "Lỗi không xác định", Toast.LENGTH_SHORT).show()
        }
    }

    private fun observeAddToCartResult() {
        cartViewModel.addProductToCartMsg.observe(this) { message ->
            message?.let {
                Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
                Log.d(TAG, it)
            }
        }

        cartViewModel.error.observe(this) { error ->
            error?.let {
                Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
            }
        }

    }
}