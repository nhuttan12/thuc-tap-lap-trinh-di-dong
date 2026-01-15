package com.example.e_commerce.Fragment


import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.example.e_commerce.R
import org.json.JSONObject

class InfoFragment : Fragment() {
    private lateinit var etFullName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etPhone: EditText
    private lateinit var etAddress: EditText
    private lateinit var btnEdit: Button
    private var isEditMode = false
    private lateinit var accessToken: String

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_info_profile, container, false)

        etFullName = view.findViewById(R.id.etFullName)
        etEmail = view.findViewById(R.id.etEmail)
        etPhone = view.findViewById(R.id.etPhone)
        etAddress = view.findViewById(R.id.etAddress)
        btnEdit = view.findViewById(R.id.btnEdit)

        // Lấy token từ SharedPreferences
        accessToken = requireActivity().getSharedPreferences("APP_PREF", AppCompatActivity.MODE_PRIVATE)
            .getString("ACCESS_TOKEN", "") ?: ""

        loadProfile()

        btnEdit.setOnClickListener {
            if (!isEditMode) enableEditMode(true) else updateProfile()
        }

        return view
    }

    private fun enableEditMode(enable: Boolean) {
        isEditMode = enable
        etFullName.isEnabled = enable
        etPhone.isEnabled = enable
        etAddress.isEnabled = enable
        btnEdit.text = if (enable) "Lưu" else "Chỉnh sửa"
    }

    private fun loadProfile() {
        val url = "http://10.0.2.2:8080/user/info"

        val request = object : StringRequest(
            Method.GET, url,
            Response.Listener { response ->
                val json = JSONObject(response)
                etFullName.setText(json.optString("fullName", ""))
                etEmail.setText(json.optString("email", ""))
                etPhone.setText(json.optString("phoneNumber", ""))
                etAddress.setText(json.optString("address", ""))
            },
            Response.ErrorListener { error ->
                val msg = error.networkResponse?.data?.let {
                    JSONObject(String(it)).optString("message", "Lỗi khi load profile")
                } ?: "Không thể kết nối server"
                Toast.makeText(requireContext(), msg, Toast.LENGTH_LONG).show()
            }) {
            override fun getHeaders(): MutableMap<String, String> {
                return mutableMapOf("Authorization" to "Bearer $accessToken")
            }
        }

        Volley.newRequestQueue(requireContext()).add(request)
    }

    private fun updateProfile() {
        val url = "http://10.0.2.2:8080/user/profile"

        val params = HashMap<String, String>()
        params["fullName"] = etFullName.text.toString()
        params["phoneNumber"] = etPhone.text.toString()
        params["address"] = etAddress.text.toString()

        val request = object : StringRequest(
            Method.PATCH, url,
            Response.Listener { response ->
                Toast.makeText(requireContext(), "Cập nhật thành công", Toast.LENGTH_SHORT).show()
                enableEditMode(false)
            },
            Response.ErrorListener { error ->
                val msg = error.networkResponse?.data?.let {
                    JSONObject(String(it)).optString("message", "Lỗi khi cập nhật profile")
                } ?: "Không thể kết nối server"
                Toast.makeText(requireContext(), msg, Toast.LENGTH_LONG).show()
            }) {
            override fun getHeaders(): MutableMap<String, String> {
                return mutableMapOf("Authorization" to "Bearer $accessToken")
            }

            override fun getParams(): MutableMap<String, String> {
                return params
            }
        }

        Volley.newRequestQueue(requireContext()).add(request)
    }
}