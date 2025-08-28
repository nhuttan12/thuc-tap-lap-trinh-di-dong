package com.example.e_commerce.Repository

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.example.e_commerce.Model.BrandModel
import com.example.e_commerce.Model.ItemModel
import com.example.e_commerce.Model.SliderModel

class MainRepository {
    private val _brands = MutableLiveData<MutableList<BrandModel>>()
    private val _banners = MutableLiveData<List<SliderModel>>()
    private val _popular = MutableLiveData<List<ItemModel>>()

    val brands: LiveData<MutableList<BrandModel>> get() = _brands
    val banners: LiveData<List<SliderModel>> get() = _banners
    val popular: LiveData<List<ItemModel>> get() = _popular

    fun loadBrands() {
        val brandList = mutableListOf<BrandModel>(
            BrandModel(
                title = "Puma",
                id = 1,
                picUrl = "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053805/cat3_ascjfk.png"
            ),
            BrandModel(
                title = "Lacoste",
                id = 2,
                picUrl = "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053805/cat6_ceycg7.png"
            ),
            BrandModel(
                title = "Reebok",
                id = 3,
                picUrl = "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053805/cat5_zivadi.png"
            ),
            BrandModel(
                title = "Skechers",
                id = 4,
                picUrl = "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053805/cat4_r061f5.png"
            ),
            BrandModel(
                title = "Nike",
                id = 5,
                picUrl = "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053804/cat2_bjnm5h.png"
            ),
            BrandModel(
                title = "Adidas",
                id = 6,
                picUrl = "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053803/cat1_pybagd.png"
            )
        )

        _brands.postValue(brandList);
    }

    fun loadBanners() {
        val bannerList = mutableListOf<SliderModel>(
            SliderModel(url = "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053804/banner2_acujbo.png"),
            SliderModel(url = "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053804/banner1_atxhnk.png"),
        )

        _banners.postValue(bannerList)
    }
    
    fun loadPopular() {
        val popularList = mutableListOf<ItemModel>(
            ItemModel(
                title = "Air Jordan 1 Retro High",
                description = "The classic that started it all. Premium leather upper with iconic design elements.",
                picUrl = arrayListOf(
                    "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053806/shoes_2_netjh2.png",
                    "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053805/0_3_focgpi.png",
                ),
                size = arrayListOf("7", "8", "9", "10", "11"),
                color = arrayListOf("#9e0404", "#FFA500"),
                price = 180.0,
                oldPrice = 200.0,
                rating = 4.8,
                numberInCart = 1
            ),
            ItemModel(
                title = "Ultraboost DNA",
                description = "Responsive Boost cushioning for energy return with every stride. Perfect for daily runs.",
                picUrl = arrayListOf(
                    "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053806/shoes_4_e3xmm3.png",
                    "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053804/0_4_enoarr.png"
                ),
                size = arrayListOf("8", "8.5", "9.5", "10"),
                color = arrayListOf("#000000", "#FFFFFF"),
                price = 150.0,
                oldPrice = 180.0,
                rating = 4.5,
                numberInCart = 1
            ),
            ItemModel(
                title = "Essential T-Shirt",
                description = "A soft and comfortable cotton t-shirt, a staple for any wardrobe.",
                picUrl = arrayListOf(
                    "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053806/shoes_3_cs135r.png",
                    "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053804/0_5_d229ls.png"
                ),
                size = arrayListOf("S", "M", "L", "XL"),
                color = arrayListOf("#808080", "#0000FF", "#008000"),
                price = 25.0,
                oldPrice = 30.0,
                rating = 4.2,
                numberInCart = 1
            ),
            ItemModel(
                title = "Slim Fit Jeans",
                description = "Classic five-pocket jeans with a modern slim fit. Made from durable denim.",
                picUrl = arrayListOf(
                    "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053805/shoes_1_zwbdam.png"
                ),
                size = arrayListOf("30", "32", "34", "36"),
                color = arrayListOf("#0000FF"),
                price = 60.0,
                oldPrice = 0.0, // Set to 0.0 if there's no old price
                rating = 4.7,
                numberInCart = 1
            )
        )

        _popular.postValue(popularList)
    }
}