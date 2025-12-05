package com.example.admin

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import com.example.admin.databinding.ActivityAdminMainBinding

class AdminMainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAdminMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // R CỦA MODULE ADMIN
        val navHostFragment = supportFragmentManager
                .findFragmentById(com.example.admin.R.id.nav_host_fragment) as NavHostFragment
        val navController = navHostFragment.navController

        // Setup drawer + bottom nav
        val appBarConfiguration = AppBarConfiguration(navController.graph, binding.drawerLayout)
        binding.navigationView.setupWithNavController(navController)
        binding.bottomNav.setupWithNavController(navController)

        // Mở drawer khi nhấn menu
        binding.btnMenu.setOnClickListener {
            binding.drawerLayout.open()
        }

        // Đổi title theo tab
        navController.addOnDestinationChangedListener { _, destination, _ ->
            binding.tvScreenTitle.text = destination.label ?: "Admin"
        }
    }
}