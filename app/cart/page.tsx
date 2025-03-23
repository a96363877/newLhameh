"use client"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "../contexts/cart-context"
import BottomNav from "@/components/layout/bottom-nav"
import Header from "@/components/layout/header"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Header />

      <div className="bg-gray-100 py-4 text-center">
        <h1 className="text-2xl font-bold">سلة التسوق</h1>
      </div>

      <div className="container mx-auto px-4 py-6">
        {items.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <div className="mb-4 flex justify-center">
              <Image src="/empty-cart.png" alt="سلة فارغة" width={150} height={150} />
            </div>
            <h2 className="mb-2 text-xl font-bold">سلة التسوق فارغة</h2>
            <p className="mb-6 text-gray-600">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
            <Link href="/products" className="inline-block rounded-md bg-blue-500 px-6 py-3 text-white">
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 p-4">
                  <h2 className="text-lg font-bold">المنتجات ({items.length})</h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="flex p-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="mr-4 flex-grow">
                        <h3 className="text-base font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">د.ك {item.price.toFixed(3)}</p>

                        <div className="mt-2 flex items-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="rounded-full border border-gray-300 p-1"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-3 min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="rounded-full border border-gray-300 p-1"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500"
                          aria-label="إزالة من السلة"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <div className="font-bold">د.ك {(item.price * item.quantity).toFixed(3)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="rounded-lg bg-white p-4 shadow">
                <h2 className="mb-4 text-lg font-bold">ملخص الطلب</h2>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>إجمالي المنتجات</span>
                    <span>د.ك {totalPrice.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>التوصيل</span>
                    <span>مجاني</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-bold">
                      <span>الإجمالي</span>
                      <span>د.ك {totalPrice.toFixed(3)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/checkout"
                    className="block w-full rounded-md bg-blue-500 py-3 text-center font-medium text-white"
                  >
                    إتمام الطلب
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}

