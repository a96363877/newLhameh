import Image from "next/image"
import Link from "next/link"
import CheckoutButton from "./chekout-btn"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  description?: string
}

export default function ProductCard({ id, name, price, image, description }: ProductCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/product/${id}`}>
        <div className="relative h-48 w-full">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
      </Link>

      <div className="p-4 text-right" dir="rtl">
        <Link href={`/product/${id}`}>
          <h3 className="font-bold text-lg mb-1">{name}</h3>
        </Link>

        {description && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>}

        <div className="flex justify-between items-center mb-3">
          <span className="text-blue-500 font-bold">{price.toFixed(2)} د.ك</span>
        </div>

        <CheckoutButton productId={id} productName={name} price={price} />
      </div>
    </div>
  )
}

