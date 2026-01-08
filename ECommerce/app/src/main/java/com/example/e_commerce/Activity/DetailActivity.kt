package com.example.e_commerce.Activity

import android.graphics.Paint
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.example.e_commerce.Adapter.ColorAdapter
import com.example.e_commerce.Adapter.DescriptionAdapter
import com.example.e_commerce.Adapter.PicsAdapter
import com.example.e_commerce.Adapter.SizeAdapter
import com.example.e_commerce.Helper.ManagementCart
import com.example.e_commerce.Model.ProductDetailModel
import com.example.e_commerce.databinding.ActivityDetailBinding
import java.text.DecimalFormat

class DetailActivity : AppCompatActivity() {
    private lateinit var binding: ActivityDetailBinding
    private lateinit var item: ProductDetailModel
    private lateinit var managementCart: ManagementCart
    private val priceFormat: DecimalFormat = DecimalFormat("#,###.##")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        managementCart = ManagementCart(this)
        item = intent.getSerializableExtra("object")!! as ProductDetailModel

        setupViews()
        setupPicsList()
        setupColorsList()
        setupSizeList()
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
            managementCart.insert(item)
        }
    }

    private fun updateTotalPrice() = with(binding) {
        totalPriceTxt.text = priceFormat.format(item.price * item.numberInCart)
    }
}