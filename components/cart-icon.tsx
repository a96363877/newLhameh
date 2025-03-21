"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/app/contexts/cart-context"

export default function CartIcon() {
  const { totalItems } = useCart()

  return (
    <Link href="/cart" className="flex flex-col items-center justify-center">
      <div className="relative">
        <ShoppingBag className="h-6 w-6" />
        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-xs">
          {totalItems}
        </span>
      </div>
      <span className="text-xs mt-1">السلة</span>
    </Link>
  )
}

