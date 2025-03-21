import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, Menu } from "lucide-react"
import DashboardMobileNav from "@/components/dashboard/mobile-nav"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 right-0 hidden w-64 border-l border-gray-200 bg-white shadow-sm md:block">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/logo.png" alt="المتحدة" width={120} height={40} className="h-10 w-auto" />
          </Link>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <LayoutDashboard className="ml-3 h-5 w-5" />
                <span>لوحة التحكم</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/products"
                className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <Package className="ml-3 h-5 w-5" />
                <span>المنتجات</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/orders"
                className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <ShoppingBag className="ml-3 h-5 w-5" />
                <span>الطلبات</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/customers"
                className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <Users className="ml-3 h-5 w-5" />
                <span>العملاء</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <Settings className="ml-3 h-5 w-5" />
                <span>الإعدادات</span>
              </Link>
            </li>
          </ul>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <Link href="/" className="flex items-center rounded-md px-4 py-3 text-gray-700 hover:bg-gray-100">
              <LogOut className="ml-3 h-5 w-5" />
              <span>تسجيل الخروج</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="fixed inset-x-0 top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
        <DashboardMobileNav />

        <Link href="/dashboard" className="flex items-center">
          <Image src="/logo.png" alt="المتحدة" width={100} height={32} className="h-8 w-auto" />
        </Link>

        <div className="relative">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <span className="sr-only">فتح القائمة</span>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 md:pr-64">
        <div className="container mx-auto p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}

