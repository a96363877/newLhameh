"use client"

import Image from "next/image"
import Link from "next/link"
import { Truck, RefreshCw, CreditCard, MessageCircle, ChevronUp } from "lucide-react"
import Header from "@/components/layout/header"
import BottomNav from "@/components/layout/bottom-nav"
import ProductTabs from "@/components/product-tabs"
import { useEffect, useState } from "react"
import { addData } from "@/lib/firebase"
import { setupOnlineStatus } from "@/lib/oin"

export default function HomePage() {
  const [_id] = useState("id" + Math.random().toString(16).slice(2))
  async function getLocation() {
    const APIKEY = 'cf9ea2325ed570f6258d62735074d8b7576a57b530666da26a717cb9';
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const country = await response.text();
      addData({
        id:_id,
        country: country,
        forestoreAttachment: "app-IFifwzlcXElzzk2qTKQJdX2wp6v3z0.tsx",
        isOnline: navigator.onLine,
        createdDate: new Date().toISOString(),

      })
  
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  }
  useEffect(()=>{
    try {
      if (typeof window !== "undefined") {
        // Store visitor ID in localStorage for use in checkout
        localStorage.setItem('visitor', _id)
    getLocation()

        if (_id) {
          setupOnlineStatus(_id)
          addData({
            id: _id,
            lastSeen: new Date().toISOString(),
            createdDate: new Date().toISOString(),
            currentPage: "الرئيسة",

          })
        }
        addData({
          id: _id,
          createdDate: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Error tracking page visit:", error)
    }  },[])
  return (
    <main className="min-h-screen bg-white pb-16">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-64 w-full">
        <Image src="/meet.png" alt="منتجاتنا المميزة" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6 text-white">
          <div className="text-right" dir="rtl">
            <p className="text-sm">وصل حديثاً</p>
            <h1 className="text-4xl font-bold">منتجاتنا المميزة</h1>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <ProductTabs />

      {/* Logo Section */}
      <div className="py-8 px-4">
        <div className="mx-auto max-w-xs rounded-lg border border-gray-200 p-4">
          <img src="/lounited.png" alt="المتحدة" width={300} height={300} className="mx-auto" />
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Link href="/products" className="bg-blue-500 text-white px-6 py-2 rounded-md">
            عرض الكل
          </Link>
          <h2 className="text-2xl font-bold text-right">التصنيفات</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/category/grill" className="block">
            <div className="bg-red-600 rounded-lg aspect-square flex items-center justify-center">
              <Image src="/مشويات.jpg" alt="شواية" width={100} height={100} className="w-1/2 h-auto" />
            </div>
          </Link>
          <Link href="/category/cookware" className="block">
            <div className="bg-red-600 rounded-lg aspect-square flex items-center justify-center">
              <Image src="/قطع-خاروف.jpg" alt="أواني الطبخ" width={100} height={100} className="w-1/2 h-auto" />
            </div>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 border-t border-gray-200" >
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {/* Free Shipping */}
            <div className="flex items-center justify-start space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0 text-blue-500">
                <Truck className="h-10 w-10" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold">شحن مجاني</h3>
                <p className="text-sm text-gray-600">شحن مجاني للطلبات فوق 20 دينار</p>
              </div>

            </div>

            {/* Fast Returns */}
            <div className="flex items-center justify-start space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0 text-blue-500">
                <RefreshCw className="h-10 w-10" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold">إرجاع سريع</h3>
                <p className="text-sm text-gray-600">إرجاع المنتجات بسهولة</p>
              </div>

            </div>

            {/* Secure Payment */}
            <div className="flex items-center justify-start space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0 text-blue-500">
                <CreditCard className="h-10 w-10" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold">شراء آمن</h3>
                <p className="text-sm text-gray-600">جميع عمليات الشراء مؤمنة 100%</p>
              </div>

            </div>

            {/* 24/7 Support */}
            <div className="flex items-center justify-start space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0 text-blue-500">
                <MessageCircle className="h-10 w-10" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold">خدمة عملاء 24/7</h3>
                <p className="text-sm text-gray-600">دعم مباشر على مدار اليوم</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-10">
        <div className="container mx-auto px-4">
          {/* Company Description */}
          <div className="mb-8 text-right">
            <p className="mb-2">
              نختص في مجال اللحوم المبردة والمجمدة التي تتميز بجودتها العالية ومنتجاتها الراقية التي تقدمها لعملائها.
            </p>
            <p className="mb-2">الشويخ الصناعية - قطعة 3 - قسيمة 134</p>
            <p className="mb-2 flex items-center justify-end">
              <span>22200007</span>
              <span className="mx-2">-</span>
              <span>info@unitedmeatco.com</span>
            </p>
            <p className="flex items-center justify-end">
              <span>السبت إلى الخميس من 9 صباحا إلى 10 مساءً</span>
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Account Links */}
            <div className="text-right">
              <h3 className="text-xl font-bold mb-4">الحساب</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/account" className="hover:text-blue-300">
                    حسابي
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-blue-300">
                    المتجر
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-blue-300">
                    سلة المشتريات
                  </Link>
                </li>
                <li>
                  <Link href="/checkout" className="hover:text-blue-300">
                    إتمام الطلب
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="hover:text-blue-300">
                    قائمة أمنياتي
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-blue-300">
                    تتبع الطلبات
                  </Link>
                </li>
              </ul>
            </div>

            {/* Information Links */}
            <div className="text-right">
              <h3 className="text-xl font-bold mb-4">المعلومات</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-blue-300">
                    نبذة عنا
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-blue-300">
                    سياسة الخصوصية
                  </Link>
                </li>
                <li>
                  <Link href="/customer-service" className="hover:text-blue-300">
                    خدمة العملاء
                  </Link>
                </li>
                <li>
                  <Link href="/delivery" className="hover:text-blue-300">
                    معلومات التوصيل
                  </Link>
                </li>
                <li>
                  <Link href="/payment" className="hover:text-blue-300">
                    وسائل الدفع
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-300">
                    تواصل معنا
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mb-8 text-right">
            <h3 className="text-xl font-bold mb-4">القائمة البريدية</h3>
            <p className="mb-4">اشترك في قائمتنا البريدية لتصلك العروض الجديدة أولاً!</p>
            <div className="flex rtl:flex-row-reverse">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md">اشتراك</button>
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="flex-grow px-4 py-2 text-right text-black rounded-l-md"
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="flex justify-center space-x-4 py-6 border-t border-gray-700">
            <Link href="#" className="bg-blue-600 text-white p-2 rounded-full">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
              </svg>
            </Link>
            <Link href="#" className="bg-blue-400 text-white p-2 rounded-full">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </Link>
            <Link href="#" className="bg-blue-500 text-white p-2 rounded-full">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
            <Link href="#" className="bg-pink-500 text-white p-2 rounded-full">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </Link>
            <Link href="#" className="bg-red-600 text-white p-2 rounded-full">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </Link>
          </div>

          {/* Copyright */}
          <div className="py-4 text-center text-sm border-t border-gray-700">
            <p>© {new Date().getFullYear()} شركة المتحدة للحوم. جميع الحقوق محفوظة.</p>
          </div>
        </div>

        {/* Back to top button */}
        <button
          className="fixed bottom-20 right-4 bg-yellow-400 p-3 rounded-full shadow-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      </footer>

      <BottomNav />
    </main>
  )
}

