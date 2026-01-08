/**
 * @description Helper class for converting color names to hex values
 * @author @nhuttan12
 * @since 2026-01-08
 * @version 1.0.0
 */

package com.example.e_commerce.Helper

class ColorConverter {
    fun convertColorNameToHex(colorName: String): String {
        return when (colorName.trim().lowercase()) {
            "đen" -> "#000000"
            "đen lõi" -> "#0A0A0A"
            "đen cực quang" -> "#010B13"
            "carbon" -> "#2E2E2E"

            "trắng" -> "#FFFFFF"
            "trắng mây" -> "#F5F5F5"
            "trắng wonder" -> "#F0F8FF"
            "trắng phấn" -> "#FFFDD0"
            "trắng pha lê" -> "#F8F8FF"
            "bạc ánh kim" -> "#C0C0C0"
            "bạc halo" -> "#D1D1D1"
            "bạc đậm" -> "#A9A9A9"

            "đỏ" -> "#FF0000"
            "đỏ lucid" -> "#DC143C"
            "hồng" -> "#FFC0CB"
            "hồng spark" -> "#FF69B4"
            "hồng trong suốt" -> "#FFB6C1"
            "hồng đất putty" -> "#E1A39B"

            "xanh dương" -> "#0000FF"
            "xanh dương rush" -> "#1E90FF"
            "xanh lam lucid" -> "#007FFF"
            "xanh navy" -> "#000080"

            "xanh lá" -> "#008000"
            "xanh lá spark" -> "#2EED07"
            "xanh olive" -> "#808000"
            "xanh olive tối" -> "#556B2F"

            "xám" -> "#808080"
            "xám mức 1" -> "#D3D3D3"
            "xám mức 4" -> "#A9A9A9"
            "xám mức 5" -> "#696969"
            "xám strata" -> "#4F4F4F"

            "vàng" -> "#FFFF00"
            "vàng ánh kim" -> "#FFD700"
            "be" -> "#F5F5DC"
            "be putty" -> "#E3DAC9"
            "yến mạch" -> "#D6CFC7"
            "nâu" -> "#A52A2A"

            "tím preloved" -> "#800080"

            else -> "#000000"
        }
    }

    fun convertColorListToHex(colorList: List<String>): List<String> {
        return colorList.map { convertColorNameToHex(it) }
    }

}