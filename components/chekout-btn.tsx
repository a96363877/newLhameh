"use client"

import { ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

interface CheckoutButtonProps {
  productId: string
  productName: string
  price: number
  quantity?: number
}

export default function CheckoutButton({ productId, productName, price, quantity = 1 }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      router.push("/checkout")
    } catch (error) {
      console.error("Error processing checkout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
    className={`flex items-center justify-center rounded-md bg-blue-500 px-1 py-2 text-white transition-all hover:bg-blue-600 mx-2`}
    size={'sm'}
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="animate-pulse">جاري التحميل...</span>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          <span>اطلب الآن</span>
        </>
      )}
    </Button>
  )
}

