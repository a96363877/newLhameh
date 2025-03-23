import Image from "next/image"
import { Heart } from "lucide-react"
import AddToCartButton from "@/components/add-to-cart-button"

// Sample product data

const products = [
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
];


export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gray-100 py-4 text-center">
        <h1 className="text-2xl font-bold">المتجر</h1>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <div>{/* Left empty for layout balance */}</div>
        <div className="text-gray-600">المتجر</div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1   gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative rounded-lg bg-white shadow">
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                <button
                  className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow"
                  aria-label={product.isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                >
                  <Heart className={`h-5 w-5 ${product.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>
              <div className="p-3 text-center">
                <div className="mb-1 text-xs text-gray-500">متوفر الآن</div>
                <h3 className="mb-2 text-sm font-medium">{product.name}</h3>
                <div className="text-sm font-bold text-gray-900">د.ك {product.price.toFixed(3)}</div>
              </div>
              <div className="p-3 flex justify-center">
                <AddToCartButton className="px-2" product={product}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

