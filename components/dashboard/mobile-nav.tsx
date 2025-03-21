"use client"

import { useState } from "react"
import Link from "next/link"
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, Menu, X } from "lucide-react"

export default function DashboardMobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
      >
        <span className="sr-only">فتح القائمة</span>
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="fixed inset-y-0 right-0 w-64 bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between border-b border-gray-200 pb-4">
              <button onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-bold">القائمة</h2>
            </div>

            <nav className="mt-6">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/dashboard"
                    className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="ml-3 h-5 w-5" />
                    <span>لوحة التحكم</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/products"
                    className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <Package className="ml-3 h-5 w-5" />
                    <span>المنتجات</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/orders"
                    className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <ShoppingBag className="ml-3 h-5 w-5" />
                    <span>الطلبات</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/customers"
                    className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <Users className="ml-3 h-5 w-5" />
                    <span>العملاء</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="ml-3 h-5 w-5" />
                    <span>الإعدادات</span>
                  </Link>
                </li>
              </ul>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <Link
                  href="/"
                  className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <LogOut className="ml-3 h-5 w-5" />
                  <span>تسجيل الخروج</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

