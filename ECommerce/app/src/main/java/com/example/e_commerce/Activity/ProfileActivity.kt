package com.example.e_commerce.Activity

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.toolbox.Volley
import com.example.e_commerce.Fragment.ChangePasswordFragment
import com.example.e_commerce.Fragment.InfoFragment
import com.example.e_commerce.R
import com.example.e_commerce.network.MultipartRequest
import java.io.ByteArrayOutputStream

class ProfileActivity : AppCompatActivity() {

    private lateinit var imgAvatar: ImageView
    private lateinit var tvEditAvatar: TextView

    private val PICK_IMAGE_REQUEST = 1001


    /**
     * Hàm khởi tạo màn hình Profile
     * - Gán layout
     * - Ánh xạ view
     * - Load thông tin user (avatar)
     * - Gắn sự kiện click
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.profile_activity)

        imgAvatar = findViewById(R.id.imgAvatar)
        tvEditAvatar = findViewById(R.id.tvEditAvatar)

        loadUserProfile()

        val btnInfo = findViewById<Button>(R.id.btnInfo)
        val btnChangePass = findViewById<Button>(R.id.btnChangePass)
        val btnLogout = findViewById<Button>(R.id.btnLogout)

        // Mặc định hiển thị InfoFragment
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, InfoFragment())
            .commit()

        tvEditAvatar.setOnClickListener {
            openGallery()
        }

        btnInfo.setOnClickListener {
            supportFragmentManager.beginTransaction()
                .replace(R.id.fragmentContainer, InfoFragment())
                .commit()
        }

        btnChangePass.setOnClickListener {
            supportFragmentManager.beginTransaction()
                .replace(R.id.fragmentContainer, ChangePasswordFragment())
                .commit()
        }

        btnLogout.setOnClickListener {
            val prefs = getSharedPreferences("APP_PREF", MODE_PRIVATE)
            prefs.edit().clear().apply()

            val intent = Intent(this, LoginActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            startActivity(intent)
            finish()
        }
    }

    /**
     * Mở trình chọn ảnh của hệ thống (Storage Access Framework)
     * Cho phép user chọn ảnh từ máy
     */
    private fun openGallery() {
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "image/*"
        }
        startActivityForResult(intent, PICK_IMAGE_REQUEST)
    }


    /**
     * Nhận kết quả ảnh sau khi user chọn
     * - Lấy Uri
     * - Lưu quyền đọc Uri
     * - Convert sang Bitmap
     * - Hiển thị preview
     * - Upload avatar
     */
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == Activity.RESULT_OK) {
            val imageUri: Uri = data?.data ?: return

            contentResolver.takePersistableUriPermission(
                imageUri,
                Intent.FLAG_GRANT_READ_URI_PERMISSION
            )

            val bitmap = uriToBitmap(imageUri)

            imgAvatar.setImageBitmap(bitmap)
            uploadAvatar(bitmap)
        }
    }


    /**
     * Upload avatar lên backend bằng multipart/form-data
     * - POST /user/avatar
     * - Gửi token JWT
     * - Gửi file với key = "file"
     */
    private fun uploadAvatar(bitmap: Bitmap) {
        val url = "http://10.0.2.2:8080/user/avatar"
        val token = getSharedPreferences("APP_PREF", MODE_PRIVATE)
            .getString("ACCESS_TOKEN", "") ?: ""

        val request = object : MultipartRequest(
            Request.Method.POST,
            url,
            { response ->
                Toast.makeText(this, "Upload avatar thành công", Toast.LENGTH_SHORT).show()
            },
            { error ->
                Toast.makeText(this, "Upload thất bại", Toast.LENGTH_LONG).show()
            }
        ) {
            override fun getHeaders(): MutableMap<String, String> {
                val headers = HashMap<String, String>()
                headers["Authorization"] = "Bearer $token"
                return headers
            }

            override fun getByteData(): MutableMap<String, DataPart> {
                val params = HashMap<String, DataPart>()
                params["file"] = DataPart(
                    "avatar.jpg",
                    bitmapToByteArray(bitmap),
                    "image/jpeg"
                )
                return params
            }
        }

        Volley.newRequestQueue(this).add(request)
    }

    /**
     * Convert Bitmap sang ByteArray
     * Dùng để upload qua multipart request
     */
    private fun bitmapToByteArray(bitmap: Bitmap): ByteArray {
        val stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 90, stream)
        return stream.toByteArray()
    }

    /**
     * Chuyển Uri ảnh thành Bitmap
     * Phục vụ preview và upload
     */
    private fun uriToBitmap(uri: Uri): Bitmap {
        val inputStream = contentResolver.openInputStream(uri)
        return android.graphics.BitmapFactory.decodeStream(inputStream!!)
    }


    /**
     * Gọi API backend để lấy thông tin user hiện tại
     * - Endpoint: GET /user/info
     * - Lấy avatar URL từ response
     * - Hiển thị avatar bằng Glide
     */
    private fun loadUserProfile() {
        val url = "http://10.0.2.2:8080/user/info"
        val token = getSharedPreferences("APP_PREF", MODE_PRIVATE)
            .getString("ACCESS_TOKEN", "") ?: ""

        val request = object : com.android.volley.toolbox.StringRequest(
            Method.GET,
            url,
            { response ->
                val json = org.json.JSONObject(response)
                val avatarUrl = json.optString("avatarUrl")

                if (avatarUrl.isNotEmpty()) {
                    com.bumptech.glide.Glide.with(this)
                        .load(avatarUrl)
                        .placeholder(R.mipmap.ic_launcher_round)
                        .error(R.mipmap.ic_launcher_round)
                        .into(imgAvatar)
                }
            },
            { }
        ) {
            override fun getHeaders(): MutableMap<String, String> {
                return hashMapOf(
                    "Authorization" to "Bearer $token"
                )
            }
        }

        Volley.newRequestQueue(this).add(request)
    }

}
