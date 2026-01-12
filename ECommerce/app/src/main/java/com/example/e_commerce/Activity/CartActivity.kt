package com.example.e_commerce.Activity

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.e_commerce.Adapter.Action.OnCartItemActionListener
import com.example.e_commerce.Adapter.CartAdapter
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Model.CartItemModel
import com.example.e_commerce.ViewModel.CartViewModel
import com.example.e_commerce.databinding.ActivityCartBinding
import kotlin.math.roundToInt

class CartActivity : AppCompatActivity() {
    private lateinit var binding: ActivityCartBinding
    private lateinit var cartViewModel: CartViewModel

    private var tax: Double = 0.0

    /**
     * Init cart adapter with empty data list
     */
    private val cartAdapter: CartAdapter by lazy {
        CartAdapter(
            listItemSelected = arrayListOf(),
            context = this,
            listener = object : OnCartItemActionListener {
                override fun onIncrease(item: CartItemModel) {
                    cartViewModel.onIncrease(item)
                }

                override fun onDecrease(item: CartItemModel) {
                    cartViewModel.onDecrease(item)
                }
            })
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityCartBinding.inflate(layoutInflater)
        enableEdgeToEdge()
        setContentView(binding.root)

        /**
         * Using view model provider to initialize
         */
        val tinyDB = TinyDB(this)
        cartViewModel = CartViewModel(tinyDB)

        /**
         * Init view
         */
        initView()
        initCartListObservers()

        cartViewModel.loadUserCart(limit = 20, page = 1)
    }

    private fun initView() {
        binding.backBtn.setOnClickListener {
            finish()
        }

        binding.viewCart.layoutManager = LinearLayoutManager(this)
        binding.viewCart.adapter = cartAdapter
    }

    private fun initCartListObservers() {
        cartViewModel.cartItem.observe(this) { list ->
            cartAdapter.updateData(list)
            calculateCart(list)

            binding.emptyTxt.visibility = if (list.isEmpty()) View.VISIBLE else View.GONE
            binding.scrollView2.visibility = if (list.isEmpty()) View.GONE else View.VISIBLE
        }

        cartViewModel.loading.observe(this) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        cartViewModel.error.observe(this) { message ->
            Toast.makeText(this, message ?: "Lỗi không xác định", Toast.LENGTH_SHORT).show()
        }
    }

    private fun calculateCart(cartItemModels: List<CartItemModel>) {
        val percentTax: Double = 0.02
        val delivery: Double = 10.0
        val itemTotal = cartItemModels.sumOf { it.price * it.numberInCart }
        tax = ((itemTotal * percentTax) * 100).roundToInt() / 100.0
        val total = ((itemTotal + tax + delivery) * 100).roundToInt() / 100

        val formatter = java.text.DecimalFormat("#,###")

        with(binding) {
            totalFeeTxt.text = "${formatter.format(itemTotal)} đồng"
            taxTxt.text = "${formatter.format(tax)} đồng"
            deliveryTxt.text = "${formatter.format(delivery)} đồng"
            totalTxt.text = "${formatter.format(total)} đồng"
        }
    }
}