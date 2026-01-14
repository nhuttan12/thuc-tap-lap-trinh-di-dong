package com.example.admin

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import com.example.admin.databinding.ActivityAdminMainBinding

class AdminMainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAdminMainBinding
    private val TAG = "AdminMainActivity"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        Log.d(TAG, "🎬 Activity created")

        // Tìm NavHostFragment bằng đúng ID trong layout
        val navHostFragment = supportFragmentManager.findFragmentById(R.id.nav_host_fragment)

        if (navHostFragment == null) {
            Log.e(TAG, " ERROR: NavHostFragment not found with ID: nav_host_fragment")
            // Kiểm tra tất cả view IDs
            Log.d(TAG, "🔍 Checking all view IDs...")

            // Tìm fragment bằng cách khác
            val fragments = supportFragmentManager.fragments
            if (fragments.isNotEmpty()) {
                val firstFragment = fragments[0]
                if (firstFragment is NavHostFragment) {
                    Log.d(TAG, " Found NavHostFragment in fragments list")
                    setupNavigation(firstFragment.navController)
                }
            }
            return
        }

        Log.d(TAG, "✅ NavHostFragment found")
        val navController = (navHostFragment as NavHostFragment).navController
        setupNavigation(navController)
    }

    private fun setupNavigation(navController: androidx.navigation.NavController) {
        Log.d(TAG, "🧭 Setting up navigation")
        Log.d(TAG, " Graph ID: ${navController.graph.id}")
//        Log.d(TAG, " Start Destination: ${navController.graph.startDestination}")

        // Tạo AppBarConfiguration với các top-level destinations
        val appBarConfiguration = AppBarConfiguration(
                setOf(
                        R.id.dashboardFragment,
                        R.id.productListFragment,
                        R.id.orderListFragment,
                        R.id.userListFragment
                ),
                binding.drawerLayout
        )



        Log.d(TAG, "🔗 Setting up BottomNavigationView")
        Log.d(TAG, "📱 BottomNav view: ${binding.bottomNav}")
        Log.d(TAG, "📱 NavigationView: ${binding.navigationView}")

        // Setup với nav controller
        binding.navigationView.setupWithNavController(navController)
        binding.bottomNav.setupWithNavController(navController)

        // Kiểm tra menu items
        val bottomMenu = binding.bottomNav.menu
        Log.d(TAG, "📋 Bottom nav items: ${bottomMenu.size()}")
        for (i in 0 until bottomMenu.size()) {
            val item = bottomMenu.getItem(i)
            Log.d(TAG, "  - Item ${item.itemId}: ${item.title}")
        }

        // Mở drawer khi nhấn menu
        binding.btnMenu.setOnClickListener {
            Log.d(TAG, "🍔 Menu button clicked")
            if (binding.drawerLayout.isDrawerOpen(binding.navigationView)) {
                binding.drawerLayout.closeDrawer(binding.navigationView)
            } else {
                binding.drawerLayout.openDrawer(binding.navigationView)
            }
        }

        // Đổi title theo destination
        navController.addOnDestinationChangedListener { _, destination, _ ->
            val title = destination.label ?: "Admin"
            Log.d(TAG, " Destination changed to: $title (ID: ${destination.id})")
            binding.tvScreenTitle.text = title
        }

        // Thêm log để debug drawer navigation
        binding.navigationView.setNavigationItemSelectedListener { menuItem ->
            Log.d(TAG, " Drawer item selected: ${menuItem.title} (ID: ${menuItem.itemId})")

            // Handle navigation manually nếu cần
            when (menuItem.itemId) {
                R.id.nav_dashboard -> {
                    navController.navigate(R.id.dashboardFragment)
                    binding.drawerLayout.closeDrawer(binding.navigationView)
                    true
                }
                R.id.productListFragment -> {
                    navController.navigate(R.id.productListFragment)
                    binding.drawerLayout.closeDrawer(binding.navigationView)
                    true
                }
                R.id.nav_orders -> {
                    navController.navigate(R.id.orderListFragment)
                    binding.drawerLayout.closeDrawer(binding.navigationView)
                    true
                }
                R.id.nav_users -> {
                    navController.navigate(R.id.userListFragment)
                    binding.drawerLayout.closeDrawer(binding.navigationView)
                    true
                }
                else -> {
                    binding.drawerLayout.closeDrawer(binding.navigationView)
                    false
                }
            }
        }
    }

    override fun onBackPressed() {
        val navHostFragment = supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as? NavHostFragment
        val navController = navHostFragment?.navController

        if (navController?.currentDestination?.id != R.id.dashboardFragment) {
            // Nếu không phải ở dashboard, xử lý back bình thường
            super.onBackPressed()
        } else {
            // Đang ở dashboard, hỏi muốn thoát app không
            // (Có thể thêm dialog confirm)
            finish()
        }
    }
}