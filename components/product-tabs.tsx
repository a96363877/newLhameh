"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import AddToCartButton from "./add-to-cart-button"
import CheckoutButton from "./chekout-btn"

// Sample product data

const products = [
  {
    id: 17,
    name: "خروف نعيمي عربي سوري",
    category: "لحوم",
    price: 35.0,
    image: "/5983430270361128743.jpg",
    isFavorite: false,
  },
  {
    id: 18,
    name: "ريش غنم عربي",
    category: "لحوم",
    price: 15.0,
    image: "/5981178470547441005.jpg",
    isFavorite: false,
  },
  {
    id: 19,
    name: "ذبيحة نعيمي",
    category: "لحوم",
    price: 20.0,
    image: "/5981178470547441004.jpg",
    isFavorite: false,
  },
  {
    id: 20,
    name: "مفروم خشن عجل مبرد",
    category: "لحوم",
    price: 10.0,
    image: "/5981178470547441002.jpg",
    isFavorite: false,
  },
  {
    id: 21,
    name: "شيش طاووق طازج",
    category: "لحوم",
    price: 12.0,
    image: "/5981178470547441001.jpg",
    isFavorite: false,
  },
  {
    id: 22,
    name: "كبدة خاروف طازج",
    category: "لحوم",
    price: 14.0,
    image: "/5981178470547440999.jpg",
    isFavorite: false,
  },
  {
    id: 23,
    name: "لحم غنم طازج مكبوس",
    category: "لحوم",
    price: 18.0,
    image: "/5981178470547440998.jpg",
    isFavorite: false,
  },

  {
    id: 1,
    name: "صينية كفتة بالطماطم",
    category: "لحوم",
    price: 5.0,
    image: "/8436c80b0ffa27f5508f4614446e824b4b409c4a-300x300.jpeg",
    isFavorite: false,
  },
  {
    id: 2,
    name: "صينية كفتة بالخضار",
    category: "لحوم",
    price: 5.0,
    image: "/Meat-Kabab-With-Vegetables-Trayزحىل-300x300.jpg",
    isFavorite: false,
  },
  {
    id: 3,
    name: "دجاج مشوي بالفرن مع الخضار",
    category: "دواجن",
    price: 3.0,
    image: "/05333b02384acdd8d5aa1a2349fb5ae72a871690-300x300.jpeg",
    isFavorite: false,
  },

  {
    id: 6,
    name: "ريش غنم متبلة مع خضار مشوية",
    category: "لحوم",
    price: 7.0,
    image: "/2.jpg",
    isFavorite: false,
  },

  {
    id: 8,
    name: "تشكن لولي بوب متنوع",
    category: "دواجن",
    price: 4.9,
    image: "/4.png",
    isFavorite: false,
  },

  {
    id: 10,
    name: "شيش كباب باذنجان وكفتة",
    category: "لحوم",
    price: 5.0,
    image: "/كباب-300x300.png",
    isFavorite: false,
  },
  {
    id: 11,
    name: "كباب مع فطر على أعواد",
    category: "لحوم",
    price: 4.0,
    image: "/United-meat-87-300x300.jpg",
    isFavorite: false,
  },
  {
    id: 12,
    name: "كباب بالمكسرات على أعواد",
    category: "لحوم",
    price: 6.0,
    image: "/United-meat-82-300x300.jpg",
    isFavorite: false,
  },
  {
    id: 13,
    name: "صينية كباب اللحم مع الخضار",
    category: "جاهز للطبخ",
    price: 7.5,
    image: "/Meat-Kabab-With-Vegetables-Trayزحىل-300x300.jpg",
    isFavorite: false,
  },
  {
    id: 14,
    name: "خروف انجليزي مبرد",
    category: "لحم غنم",
    price: 60.0,
    image: "/2123.jpg",
    isFavorite: false,
  },
  {
    id: 15,
    name: "صينية ستيك ريب آي متبلة, مع خضار مقطع ",
    category: "جاهز للطبخ",
    price: 6.0,
    image: "/5.jpg",
    isFavorite: false,
  },
  {
    id: 16,
    name: "بوكستات, لحم غنم بوكس النخبة العالي",
    category: "لحم غنم",
    price: 5.0,
    image: "/777.jpg",
    isFavorite: false,
  },
]

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("bestsellers")

  return (
    <div className="py-8 max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-200 mb-6 overflow-x-auto px-4">
        <button
          className={`px-4 md:px-6 py-3 text-base md:text-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === "bestsellers"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("bestsellers")}
        >
          الأكثر مبيعاً
        </button>
        <button
          className={`px-4 md:px-6 py-3 text-base md:text-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === "featured" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("featured")}
        >
          المميزة
        </button>
        <button
          className={`px-4 md:px-6 py-3 text-base md:text-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === "discounts" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("discounts")}
        >
          تخفيضات
        </button>
      </div>
      Q{/* Products Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
                <button
                  className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow hover:bg-gray-50 transition-colors"
                  aria-label={product.isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                >
                  <Heart className={`h-5 w-5 ${product.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>
              <div className="p-4 text-right">
                <div className="text-sm text-gray-500">{product.category}</div>
                <h3 className="mt-1 text-base font-medium line-clamp-2 h-12">{product.name}</h3>
                <div className="mt-1 text-lg font-bold text-blue-600">د.ك {product.price.toFixed(3)}</div>
                <div className="mt-3 grid grid-cols-2 ">
                    <CheckoutButton
                      productId={product.id.toString()}
                      productName={product.name}
                      price={product.price}
                    />
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  )
}

