package com.example.e_commerce.Fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.e_commerce.R
import org.json.JSONObject

class ChangePasswordFragment : Fragment() {

    private lateinit var edtOldPass : EditText
    private lateinit var edtNewPass : EditText
    private lateinit var edtConfirmPass : EditText
    private lateinit var btnChangePass : Button


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        val view = inflater.inflate(R.layout.fragment_change_password,container,false)

        //ÁNh xạ view
        edtOldPass = view.findViewById(R.id.edtOldPass)
        edtNewPass = view.findViewById(R.id.edtNewPass)
        edtConfirmPass = view.findViewById(R.id.edtConfirmPass)
        btnChangePass = view.findViewById(R.id.btnChangePassword)

        btnChangePass.setOnClickListener {
            handleChangePassword()
        }
        return view

    }
    private fun handleChangePassword() {
        val oldPass = edtOldPass.text.toString().trim()
        val newPass = edtNewPass.text.toString().trim()
        val confirmPass = edtConfirmPass.text.toString().trim()

        //Validate
        if(oldPass.isEmpty() || newPass.isEmpty() || confirmPass.isEmpty()){
            showToast("Vui lòng nhập đầy đủ thông tin")
            return
        }

        if(newPass.length < 6) {
            showToast("Mật khẩu mới phải ít nhất 6 ký tự")
            return
        }

        if(newPass!=confirmPass){
            showToast("Mật khẩu xác nhận không khớp")
            return
        }

        changePassWord(oldPass,newPass)
    }

    private fun changePassWord(oldPass: String, newPass: String) {
        val url = "http://10.0.2.2:8080/user/change-password"

        val jsonBody = org.json.JSONObject().apply{
            put("oldPassword", oldPass)
            put("newPassword", newPass)
            put("confirmPassword", newPass)
        }

        val request = object : com.android.volley.toolbox.JsonObjectRequest(
            Method.POST,
            url,
            jsonBody,
            {response ->
                showToast(response.getString("message"))
                edtOldPass.text.clear()
                edtNewPass.text.clear()
                edtConfirmPass.text.clear()
            },
            { error ->
                val message = try {
                    val json = JSONObject(String(error.networkResponse.data))
                    json.getString("message")
                } catch (e: Exception) {
                    "Đổi mật khẩu thất bại"
                }
                showToast(message)
            }
        ){
            override fun getHeaders(): MutableMap<String, String> {
                val headers = HashMap<String, String>()
                headers["Content-Type"] = "application/json"

                // LẤY TOKEN (SharedPreferences)
                val token = requireContext()
                    .getSharedPreferences("APP_PREF", android.content.Context.MODE_PRIVATE)
                    .getString("ACCESS_TOKEN", "")

                headers["Authorization"] = "Bearer $token"
                return headers
            }
        }
        com.android.volley.toolbox.Volley
            .newRequestQueue(requireContext())
            .add(request)
    }

    private fun showToast(message: String) {
        Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
    }
}


