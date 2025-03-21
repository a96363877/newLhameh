import Image from "next/image"
import { Heart } from "lucide-react"

// Sample product data
const products = [
  {
    id: 1,
    name: "لحم بقري طازج جودة ممتازة",
    price: 3.5,
    image: "/meat-1.jpg",
    isFavorite: false,
  },
  {
    id: 2,
    name: "برجر لحم بقري جودة ممتازة",
    price: 5.9,
    image: "/meat-2.jpg",
    isFavorite: true,
  },
  {
    id: 3,
    name: "لحم ضأن طازج",
    price: 55.0,
    image: "/meat-logo.jpg",
    isFavorite: false,
  },
  {
    id: 4,
    name: "شرائح لحم بقري جودة ممتازة",
    price: 5.0,
    image: "/meat-3.jpg",
    isFavorite: false,
  },
  {
    id: 5,
    name: "برجر بوكس",
    price: 15.0,
    image: "/burger-box.jpg",
    isFavorite: false,
  },
  {
    id: 6,
    name: "باربكيو بوكس",
    price: 25.0,
    image: "/bbq-box.jpg",
    isFavorite: false,
  },
]

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
        <div className="grid grid-cols-2 gap-4">
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
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

