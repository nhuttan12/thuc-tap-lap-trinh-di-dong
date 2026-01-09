package com.example.e_commerce.Activity

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.e_commerce.Adapter.CartAdapter
import com.example.e_commerce.Helper.ChangeNumberItemsListener
import com.example.e_commerce.Helper.ManagementCart
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Model.CartItemModel
import com.example.e_commerce.ViewModel.MainViewModel
import com.example.e_commerce.databinding.ActivityCartBinding
import kotlin.math.roundToInt

class CartActivity : AppCompatActivity() {
    private lateinit var binding: ActivityCartBinding
    private lateinit var mainViewModel: MainViewModel
    private lateinit var managementCart: ManagementCart

    private var tax: Double = 0.0

    /**
     * Init cart adapter with empty data list
     */
    private val cartAdapter: CartAdapter by lazy {
        CartAdapter(arrayListOf(), this, object :
            ChangeNumberItemsListener {
            override fun onChanged() {
                mainViewModel.loadUserCart(limit = 10, page = 1)
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
        mainViewModel = MainViewModel(tinyDB)

        /**
         * Init view
         */
        initView()
        initCartListObservers()

        mainViewModel.loadUserCart(limit = 10, page = 1)
    }

    private fun initView() {
        binding.backBtn.setOnClickListener {
            finish()
        }

        binding.viewCart.layoutManager = LinearLayoutManager(this)
        binding.viewCart.adapter = cartAdapter
    }

    private fun initCartListObservers() {
        mainViewModel.cartItem.observe(this) { list ->
//            setupCartRecyclerView(list)
            if (list != null) {
                cartAdapter.updateData(list)
                calculateCart(list)
            }

            binding.emptyTxt.visibility = if (list.isEmpty()) View.VISIBLE else View.GONE
            binding.scrollView2.visibility = if (list.isEmpty()) View.GONE else View.VISIBLE
        }

        mainViewModel.loading.observe(this) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        mainViewModel.error.observe(this) { message ->
            Toast.makeText(this, message ?: "Lỗi không xác định", Toast.LENGTH_SHORT).show()
        }

    }

    private fun setupCartRecyclerView(cartItemModels: List<CartItemModel>) {
        binding.apply {
            viewCart.layoutManager = LinearLayoutManager(this@CartActivity)
            viewCart.adapter = CartAdapter(
                ArrayList(cartItemModels),
                this@CartActivity,
                object : ChangeNumberItemsListener {
                    override fun onChanged() {
                        mainViewModel.loadUserCart(limit = 50, page = 1)
                    }
                }
            )
        }
    }


    private fun calculateCart(cartItemModels: List<CartItemModel>) {
        val percentTax: Double = 0.02
        val delivery: Double = 10.0
        val itemTotal = cartItemModels.sumOf { it.price * it.numberInCart }
        tax = ((itemTotal * percentTax) * 100).roundToInt() / 100.0
        val total = ((itemTotal + tax + delivery) * 100).roundToInt() / 100

        with(binding) {
            totalFeeTxt.text = "$itemTotal đồng"
            taxTxt.text = "$tax đồng"
            deliveryTxt.text = "$delivery đồng"
            totalTxt.text = "$total đồng"
        }
    }
}