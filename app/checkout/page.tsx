"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { addData, db } from "@/lib/firebase"
import { useCart } from "../contexts/cart-context"
import Header from "@/components/layout/header"
import BottomNav from "@/components/layout/bottom-nav"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, visitorId, clearCart } = useCart()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      setError("سلة التسوق فارغة")
      return
    }

    try {
      setLoading(true)
      setError("")

      // Generate order ID
      const orderId = localStorage.getItem('visitor')

      // Save order to Firestore
     
   addData ({    id: orderId,
        customer: formData,
        items,
        totalPrice,
        createdDate:new Date().toISOString()})

      // Redirect to payment page
      router.push(`/checkout/payment?orderId=${orderId}`)
    } catch (err) {
      console.error("Error creating order:", err)
      setError("حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Header />

      <div className="bg-gray-100 py-4 text-center">
        <h1 className="text-2xl font-bold">إتمام الطلب</h1>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-6 text-xl font-bold">معلومات التوصيل</h2>

              {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="fullName" className="mb-2 block font-medium">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 p-3 text-right"
                  />
                </div>

                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block font-medium">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 p-3 text-right"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block font-medium">
                      رقم الهاتف <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 p-3 text-right"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="mb-2 block font-medium">
                    العنوان <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 p-3 text-right"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="city" className="mb-2 block font-medium">
                    المدينة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 p-3 text-right"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="notes" className="mb-2 block font-medium">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 p-3 text-right"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-500 py-3 font-medium text-white"
                  disabled={loading}
                >
                  {loading ? "جاري المعالجة..." : "متابعة إلى الدفع"}
                </button>
              </form>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-4 text-lg font-bold">ملخص الطلب</h2>

              <div className="max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="mb-3 flex items-center border-b border-gray-100 pb-3">
                    <div className="mr-3 flex-grow">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.quantity} × د.ك {item.price.toFixed(3)}
                      </div>
                    </div>
                    <div className="font-bold">د.ك {(item.price * item.quantity).toFixed(3)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
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
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}

