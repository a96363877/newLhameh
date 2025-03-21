import Link from "next/link"
import { User, Heart, Home } from "lucide-react"
import CartIcon from "@/components/cart-icon"

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="grid grid-cols-4 py-2">
        <Link href="/account" className="flex flex-col items-center justify-center">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">الحساب</span>
        </Link>
        <CartIcon />
        <Link href="/favorites" className="flex flex-col items-center justify-center">
          <div className="relative">
            <Heart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-xs">
              0
            </span>
          </div>
          <span className="text-xs mt-1">الأمنيات</span>
        </Link>
        <Link href="/" className="flex flex-col items-center justify-center">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">المتجر</span>
        </Link>
      </div>
    </div>
  )
}

