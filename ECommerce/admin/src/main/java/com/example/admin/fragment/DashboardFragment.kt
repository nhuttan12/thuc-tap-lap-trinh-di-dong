package com.example.admin.fragment

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import com.example.admin.R
import com.example.admin.databinding.ActivityAdminDashboardBinding

class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAdminDashboardBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Setup navigation
        val navController = findNavController(R.id.nav_host_fragment)

        // Cấu hình AppBarConfiguration
        val appBarConfiguration = AppBarConfiguration(
                setOf(R.id.nav_dashboard)
        )

        // Setup ActionBar với Navigation
        setupActionBarWithNavController(navController, appBarConfiguration)

        // Xử lý nút menu để mở drawer
        binding.btnMenu.setOnClickListener {
            binding.drawerLayout.openDrawer(binding.navigationView)
        }

        // Xử lý nút back
//        binding.btnBack.setOnClickListener {
//            onBackPressed()
//        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}