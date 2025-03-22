"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import AddToCartButton from "./add-to-cart-button"

// Sample product data

const products = [
  {
    id: 1,
    name: "صينية كفتة بالطماطم",
    category: "لحوم",
    price: 5.0,
    image: "/e164d4b7dc425d1954348ba34f274c04b121b68b-300x300.jpg",
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
    image: "/roasted-chicken-tray-with-vegetables.jpg",
    isFavorite: false,
  },
  {
    id: 4,
    name: "كفتة مدورة مع خضار مشكلة",
    category: "لحوم",
    price: 5.99,
    image: "/meatball-veggie-round-tray.jpg",
    isFavorite: false,
  },
  {
    id: 5,
    name: "كفتة بالفرن مع شرائح طماطم وبصل",
    category: "لحوم",
    price: 6.0,
    image: "/oven-kofta-with-tomato-onion.jpg",
    isFavorite: false,
  },
  {
    id: 6,
    name: "ريش غنم متبلة مع خضار مشوية",
    category: "لحوم",
    price: 7.0,
    image: "/marinated-lamb-chops-with-veggies.jpg",
    isFavorite: false,
  },
  {
    id: 7,
    name: "ريش لحم بقطع ثوم وخضار",
    category: "لحوم",
    price: 6.1,
    image: "/raw-lamb-ribs-with-veggies.jpg",
    isFavorite: false,
  },
  {
    id: 8,
    name: "تشكن لولي بوب متنوع",
    category: "دواجن",
    price: 4.9,
    image: "/chicken-lollipop.jpg",
    isFavorite: false,
  },
  {
    id: 9,
    name: "ريش غنم مشكّلة بشكل مروحة",
    category: "لحوم",
    price: 6.0,
    image: "/fan-shaped-lamb-chops.jpg",
    isFavorite: false,
  },
  {
    id: 10,
    name: "شيش كباب باذنجان وكفتة",
    category: "لحوم",
    price: 5.0,
    image: "/kofta-eggplant-skewers.jpg",
    isFavorite: false,
  },
  {
    id: 11,
    name: "كفتة مع فطر على أعواد",
    category: "لحوم",
    price: 4.0,
    image: "/kofta-mushroom-skewers.jpg",
    isFavorite: false,
  },
  {
    id: 12,
    name: "كفتة بالمكسرات على أعواد",
    category: "لحوم",
    price: 6.0,
    image: "/kofta-nuts-skewers.jpg",
    isFavorite: false,
  },
  {
    id: 13,
    name: "صينية كباب اللحم مع الخضار",
    category: "جاهز للطبخ",
    price: 7.5,
    image: "/5.png",
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
];


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
            <div key={product.id} className="relative max-h-[400px]">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img src={product.image || "/placeholder.svg"} alt={product.name}  className="object-cover" />
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

