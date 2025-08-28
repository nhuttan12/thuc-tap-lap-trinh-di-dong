package com.example.e_commerce.Activity

import android.graphics.Paint
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.example.e_commerce.Adapter.ColorAdapter
import com.example.e_commerce.Adapter.PicsAdapter
import com.example.e_commerce.Helper.ManagmentCart
import com.example.e_commerce.Model.ItemModel
import com.example.e_commerce.databinding.ActivityDetailBinding

class DetailActivity : AppCompatActivity() {
    private lateinit var binding: ActivityDetailBinding
    private lateinit var item: ItemModel
    private lateinit var managmentCart: ManagmentCart

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        managmentCart = ManagmentCart(this)
        item = intent.getSerializableExtra("object")!! as ItemModel

        setupViews()
        setupPicsList()
        setupColorsList()
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
        descriptionTxt.text = item.description
        priceTxt.text = item.price.toString()
        oldPriceTxt.text = item.oldPrice.toString()
        oldPriceTxt.paintFlags = priceTxt.paintFlags or Paint.STRIKE_THRU_TEXT_FLAG
        ratingTxt.text = "${item.rating} Rating"
        numberItemTxt.text = item.numberInCart.toString()
        updateTotalPrice()

        Glide.with(this@DetailActivity).load(item.picUrl.firstOrNull()).into(picMain)

        backBtn.setOnClickListener { finish() }

        plusBtn.setOnClickListener {
            val quantity = item.numberInCart++
            item.numberInCart = item.numberInCart++
            numberItemTxt.text = quantity.toString()
            updateTotalPrice()
        }

        minusBtn.setOnClickListener {
            if (item.numberInCart > 1) {
                val quantity = item.numberInCart--
                item.numberInCart = item.numberInCart--
                numberItemTxt.text = quantity.toString()
                updateTotalPrice()
            }
        }

        addToCartBtn.setOnClickListener {
            managmentCart.insert(item)
        }
    }

    private fun updateTotalPrice() = with(binding) {
        totalPriceTxt.text = (item.price * item.numberInCart).toString()
    }
}