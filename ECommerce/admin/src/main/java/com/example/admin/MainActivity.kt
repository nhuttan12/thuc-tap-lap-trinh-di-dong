package com.example.admin

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.admin.databinding.ActivityMainBinding
import com.example.admin.fragment.DashboardActivity
import com.example.admin.fragment.HomeFragment
//import com.example.admin.fragment.OrderFragment
//import com.example.admin.fragment.ProductFragment

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // HomeFragment đã được load tự động qua android:name
        // Không cần gọi switchFragment(HomeFragment()) lần đầu

        // Xử lý nút menu để mở drawer
        binding.btnMenu.setOnClickListener {
            binding.drawerLayout.openDrawer(binding.navigationView)
        }

        // Xử lý bottom navigation
        binding.bottomNav.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    // Nếu đang không ở HomeFragment thì chuyển về
                    if (supportFragmentManager.findFragmentById(R.id.nav_host_fragment) !is HomeFragment) {
                        switchFragment(HomeFragment())
                    }
                    binding.tvScreenTitle.text = "Trang chủ"
                    true
                }
                R.id.nav_dashboard -> {
                    // Chuyển sang DashboardActivity thay vì load fragment
                    val intent = Intent(this, DashboardActivity::class.java)
                    startActivity(intent)
                    // Giữ selection ở home để khi quay lại vẫn ở home
                    true
                }
//                R.id.nav_products -> {
//                    switchFragment(ProductFragment())
//                    binding.tvScreenTitle.text = "Sản phẩm"
//                    true
//                }
//                R.id.nav_orders -> {
//                    switchFragment(OrderFragment())
//                    binding.tvScreenTitle.text = "Đơn hàng"
//                    true
//                }
                else -> false
            }
        }

        // Xử lý drawer navigation
        binding.navigationView.setNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    if (supportFragmentManager.findFragmentById(R.id.nav_host_fragment) !is HomeFragment) {
                        switchFragment(HomeFragment())
                    }
                    binding.tvScreenTitle.text = "Trang chủ"
                    binding.bottomNav.selectedItemId = R.id.nav_home
                }
                R.id.nav_dashboard -> {
                    // Chuyển sang DashboardActivity
                    val intent = Intent(this, DashboardActivity::class.java)
                    startActivity(intent)
                }
//                R.id.nav_products -> {
//                    switchFragment(ProductFragment())
//                    binding.tvScreenTitle.text = "Sản phẩm"
//                    binding.bottomNav.selectedItemId = R.id.nav_products
//                }
//                R.id.nav_orders -> {
//                    switchFragment(OrderFragment())
//                    binding.tvScreenTitle.text = "Đơn hàng"
//                    binding.bottomNav.selectedItemId = R.id.nav_orders
//                }
            }
            binding.drawerLayout.closeDrawer(binding.navigationView)
            true
        }
    }

    private fun switchFragment(fragment: androidx.fragment.app.Fragment) {
        supportFragmentManager.beginTransaction()
                .replace(R.id.nav_host_fragment, fragment)
                .addToBackStack(null) // Thêm vào back stack để có thể back
                .commit()
    }

    // Xử lý nút back
    override fun onBackPressed() {
        if (supportFragmentManager.backStackEntryCount > 0) {
            supportFragmentManager.popBackStack()
        } else {
            super.onBackPressed()
        }
    }
}