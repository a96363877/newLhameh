"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import AddToCartButton from "./add-to-cart-button"

// Sample product data
const products = [
  {
    id: 1,
    name: "صينية كباب اللحم مع الخضار",
    category: "جاهز للطبخ",
    price: 7.5,
    image: "/كباب-300x300.png",
    isFavorite: false,
  },
  {
    id: 2,
    name: "خروف انجليزي مبرد",
    category: "لحم غنم",
    price: 60.0,
    image: "/2123.jpg",
    isFavorite: false,
  },
  {
    id: 3,
    name: "صينية ستيك ريب آي متبلة, جاهزة",
    category: "جاهز للطبخ",
    price: 6.0,
    image: "/5.jpg",
    isFavorite: false,
  },
  {
    id: 4,
    name: "بوكستات, لحم غنم بوكس النخبة العالي",
    category: "لحم غنم",
    price: 55.0,
    image: "/777.jpg",
    isFavorite: false,
  },
]

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("bestsellers")

  return (
    <div className="py-8">
      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-200">
        <button
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === "bestsellers" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("bestsellers")}
        >
          الأكثر مبيعاً
        </button>
        <button
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === "featured" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("featured")}
        >
          المميزة
        </button>
        <button
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === "discounts" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("discounts")}
        >
          تخفيضات
        </button>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                <button
                  className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow"
                  aria-label={product.isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                >
                  <Heart className={`h-5 w-5 ${product.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>
              <div className="mt-3 text-right">
                <div className="text-sm text-gray-500">{product.category}</div>
                <h3 className="mt-1 text-base font-medium">{product.name}</h3>
                <div className="mt-1 text-lg font-bold">د.ك {product.price.toFixed(3)}</div>
                <div className="mt-3">
                  <AddToCartButton product={product} className="w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

