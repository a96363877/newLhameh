"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { CheckCircle } from "lucide-react"
import Header from "@/components/layout/header"
import BottomNav from "@/components/layout/bottom-nav"

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    if (!orderId) {
      router.push("/")
      return
    }

    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, "orders", orderId)
        const orderDoc = await getDoc(orderRef)

        if (!orderDoc.exists()) {
          setError("الطلب غير موجود")
          return
        }

        setOrderData(orderDoc.data())
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("حدث خطأ أثناء جلب بيانات الطلب")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pb-16">
        <Header />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p>جاري تحميل بيانات الطلب...</p>
          </div>
        </div>
        <BottomNav />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 pb-16">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <div className="mb-4 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold">حدث خطأ</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <Link href="/" className="inline-block rounded-md bg-blue-500 px-6 py-3 text-white">
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </div>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow">
          <div className="mb-6 text-center">
            <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
            <h1 className="mt-4 text-2xl font-bold">تم تأكيد طلبك بنجاح!</h1>
            <p className="mt-2 text-gray-600">شكراً لك على طلبك. سنقوم بتجهيزه وإرساله في أقرب وقت ممكن.</p>
          </div>

          <div className="mb-6 rounded-md bg-gray-50 p-4">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-gray-500">رقم الطلب</div>
                <div className="font-medium">{orderId}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">تاريخ الطلب</div>
                <div className="font-medium">
                  {new Date().toLocaleDateString("ar-KW", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-lg font-bold">تفاصيل الطلب</h2>

            <div className="divide-y divide-gray-200">
              {orderData?.items?.map((item: any) => (
                <div key={item.id} className="flex py-3">
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

            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span>إجمالي المنتجات</span>
                <span>د.ك {orderData?.totalPrice.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن</span>
                <span>مجاني</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-bold">
                  <span>الإجمالي</span>
                  <span>د.ك {orderData?.totalPrice.toFixed(3)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-lg font-bold">معلومات التوصيل</h2>

            <div className="rounded-md bg-gray-50 p-4">
              <div className="mb-2">
                <span className="font-medium">{orderData?.customer?.fullName}</span>
              </div>
              <div className="mb-2 text-gray-600">
                {orderData?.customer?.address}، {orderData?.customer?.city}
              </div>
              <div className="text-gray-600">
                {orderData?.customer?.phone} | {orderData?.customer?.email}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0 rtl:space-x-reverse">
            <Link href="/" className="rounded-md bg-blue-500 px-6 py-3 text-center font-medium text-white">
              العودة إلى الصفحة الرئيسية
            </Link>
            <Link href="/products" className="rounded-md border border-gray-300 px-6 py-3 text-center font-medium">
              تصفح المزيد من المنتجات
            </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}

