"use client"

import { useState } from "react"
import { ShoppingBag, Check } from "lucide-react"
import { useCart } from "@/app/contexts/cart-context"

type AddToCartButtonProps = {
  product: {
    id: number
    name: string
    price: number
    image: string
  }
  className?: string
}

export default function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)

    // Reset the added state after 2 seconds
    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-600 ${className} ${added ? "bg-green-500 hover:bg-green-600" : ""}`}
      disabled={added}
    >
      {added ? (
        <>
          <Check className="mr-2 h-5 w-5" />
          <span>تمت الإضافة</span>
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-5 w-5" />
          <span>أضف إلى السلة</span>
        </>
      )}
    </button>
  )
}

