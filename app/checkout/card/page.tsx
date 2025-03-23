"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Header from "@/components/layout/header"
import BottomNav from "@/components/layout/bottom-nav"
import { useCart } from "@/app/contexts/cart-context"
import CreditCardForm, { CardData } from "@/components/payment-form"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const { clearCart } = useCart()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [orderData, setOrderData] = useState<any>(null)
  const [selectedPayment, setSelectedPayment] = useState("credit_card")
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "","",""])
  const [verifying, setVerifying] = useState(false)
  const [showCardForm, setShowCardForm] = useState(false)
  const [processingCard, setProcessingCard] = useState(false)

  useEffect(() => {
    if (!orderId) {
      router.push("/cart")
      return
    }

    const fetchOrder = async () => {
      try {
        setLoading(true)
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

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method)
    setShowCardForm(method === "credit_card")
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleProceedPayment = () => {
    if (selectedPayment === "credit_card") {
      setShowCardForm(true)
    } else {
      setShowOtp(true)
    }
  }

  const handleCardSubmit = async (cardData: CardData) => {
    try {
      setProcessingCard(true)

      // Simulate card processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show OTP verification after card is processed
      setShowOtp(true)
      setProcessingCard(false)
    } catch (error) {
      console.error("Error processing card:", error)
      setError("حدث خطأ أثناء معالجة البطاقة. يرجى المحاولة مرة أخرى.")
      setProcessingCard(false)
    }
  }

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("")

    if (otpValue.length !== 4) {
      setError("يرجى إدخال رمز التحقق كاملاً")
      return
    }

    try {
      setVerifying(true)

      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update order status in Firestore
      const orderRef = doc(db, "orders", orderId!)
      await updateDoc(orderRef, {
        status: "paid",
        paymentMethod: selectedPayment,
        paidAt: new Date(),
      })

      // Clear cart
      clearCart()

      // Redirect to success page
      router.push(`/checkout/success?orderId=${orderId}`)
    } catch (err) {
      console.error("Error processing payment:", err)
      setError("حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.")
    } finally {
      setVerifying(false)
    }
  }

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
            <button
              onClick={() => router.push("/cart")}
              className="inline-block rounded-md bg-blue-500 px-6 py-3 text-white"
            >
              العودة إلى سلة التسوق
            </button>
          </div>
        </div>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <Header />

      <div className="bg-gray-100 py-4 text-center">
        <h1 className="text-2xl font-bold">الدفع</h1>
      </div>

      <div className="container mx-auto px-4 py-6">
        {showOtp ? (
          <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
            <h2 className="mb-6 text-center text-xl font-bold">رمز التحقق</h2>

            <p className="mb-6 text-center text-gray-600">
              تم إرسال رمز التحقق إلى رقم الهاتف {orderData?.customer?.phone}
            </p>

            {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">{error}</div>}

            <div className="mb-6 flex justify-center space-x-3 rtl:space-x-reverse">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="h-14 w-14 rounded-md border border-gray-300 text-center text-2xl"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full rounded-md bg-blue-500 py-3 font-medium text-white"
              disabled={verifying}
            >
              {verifying ? "جاري التحقق..." : "تأكيد الدفع"}
            </button>

            <p className="mt-4 text-center text-sm text-gray-500">
              لم تستلم الرمز؟ <button className="text-blue-500">إعادة الإرسال</button>
            </p>
          </div>
        ) : showCardForm ? (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow">
                <CreditCardForm onSubmit={handleCardSubmit} isProcessing={processingCard} />
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="rounded-lg bg-white p-4 shadow">
                <h2 className="mb-4 text-lg font-bold">ملخص الطلب</h2>

                <div className="max-h-60 overflow-y-auto">
                  {orderData?.items?.map((item: any) => (
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
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-6 text-xl font-bold">اختر طريقة الدفع</h2>

                {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">{error}</div>}

                <div className="space-y-4">
                  <div
                    className={`flex cursor-pointer items-center rounded-md border p-4 ${
                      selectedPayment === "credit_card" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                    onClick={() => handlePaymentSelect("credit_card")}
                  >
                    <div className="mr-3 flex-grow">
                      <div className="font-medium">بطاقة ائتمان</div>
                      <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Image src="/visa.png" alt="Visa" width={40} height={25} />
                      <Image src="/mastercard.png" alt="Mastercard" width={40} height={25} />
                      <Image src="/amex.png" alt="American Express" width={40} height={25} />
                    </div>
                  </div>

                  <div
                    className={`flex cursor-pointer items-center rounded-md border p-4 ${
                      selectedPayment === "knet" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                    onClick={() => handlePaymentSelect("knet")}
                  >
                    <div className="mr-3 flex-grow">
                      <div className="font-medium">كي نت</div>
                      <div className="text-sm text-gray-500">الدفع باستخدام بطاقة كي نت</div>
                    </div>
                    <div>
                      <Image src="/knet.png" alt="KNET" width={60} height={30} />
                    </div>
                  </div>

                  <div
                    className={`flex cursor-pointer items-center rounded-md border p-4 ${
                      selectedPayment === "cash" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                    onClick={() => handlePaymentSelect("cash")}
                  >
                    <div className="mr-3 flex-grow">
                      <div className="font-medium">الدفع عند الاستلام</div>
                      <div className="text-sm text-gray-500">ادفع نقداً عند استلام طلبك</div>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedPayment}
                  className="mt-6 w-full rounded-md bg-blue-500 py-3 font-medium text-white"
                >
                  متابعة الدفع
                </button>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="rounded-lg bg-white p-4 shadow">
                <h2 className="mb-4 text-lg font-bold">ملخص الطلب</h2>

                <div className="max-h-60 overflow-y-auto">
                  {orderData?.items?.map((item: any) => (
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
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}

