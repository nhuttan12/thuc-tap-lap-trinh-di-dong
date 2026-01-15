package com.example.e_commerce.network

import com.android.volley.*
import com.android.volley.toolbox.HttpHeaderParser
import java.io.ByteArrayOutputStream

abstract class MultipartRequest(
    method: Int,
    url: String,
    private val listener: Response.Listener<String>,
    errorListener: Response.ErrorListener
) : Request<String>(method, url, errorListener) {

    private val boundary = "volley-${System.currentTimeMillis()}"
    private val mimeType = "multipart/form-data;boundary=$boundary"

    override fun getBodyContentType(): String = mimeType

    override fun getBody(): ByteArray {
        val bos = ByteArrayOutputStream()

        getByteData().forEach { (key, data) ->
            bos.write("--$boundary\r\n".toByteArray())
            bos.write(
                "Content-Disposition: form-data; name=\"$key\"; filename=\"${data.fileName}\"\r\n"
                    .toByteArray()
            )
            bos.write("Content-Type: ${data.type}\r\n\r\n".toByteArray())
            bos.write(data.content)
            bos.write("\r\n".toByteArray())
        }

        bos.write("--$boundary--\r\n".toByteArray())
        return bos.toByteArray()
    }

    override fun parseNetworkResponse(response: NetworkResponse): Response<String> {
        val result = String(response.data)
        return Response.success(result, HttpHeaderParser.parseCacheHeaders(response))
    }

    override fun deliverResponse(response: String) {
        listener.onResponse(response)
    }

    abstract fun getByteData(): Map<String, DataPart>

    data class DataPart(
        val fileName: String,
        val content: ByteArray,
        val type: String
    )
}
