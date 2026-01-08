package com.example.e_commerce.Helper

class ColorConverter {
    fun convertColorNameToHex(colorName: String): String {
        return when (colorName.trim().lowercase()) {
            "black" -> "#000000"
            "white" -> "#FFFFFF"
            "red" -> "#FF0000"
            "blue" -> "#0000FF"
            "green" -> "#008000"
            "gray" -> "#808080"
            "beige" -> "#F5F5DC"
            "brown" -> "#A52A2A"
            "navy" -> "#000080"
            "yellow" -> "#FFFF00"
            else -> "#000000"
        }
    }

    fun convertColorListToHex(colorList: List<String>): List<String> {
        return colorList.map { convertColorNameToHex(it) }
    }

}