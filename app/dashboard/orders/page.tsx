"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, Eye } from "lucide-react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"))
        const ordersSnapshot = await getDocs(ordersQuery)
        const ordersList = ordersSnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            customer: data.customer?.fullName || "عميل",
            date: data.createdAt ? data.createdAt.toDate() : new Date(),
            total: data.totalPrice || 0,
            status: data.status || "pending",
            items: data.items?.length || 0,
            paymentMethod: data.paymentMethod || "cash",
          }
        })
        setOrders(ordersList)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
      case "paid":
        return <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">مكتمل</span>
      case "processing":
        return <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">قيد التجهيز</span>
      case "shipping":
        return (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">قيد التوصيل</span>
        )
      case "cancelled":
        return <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">ملغي</span>
      default:
        return <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">معلق</span>
    }
  }

  // Helper function to get payment method text
  const getPaymentMethod = (method) => {
    switch (method) {
      case "credit_card":
        return "بطاقة ائتمان"
      case "knet":
        return "كي نت"
      case "cash":
        return "نقداً عند الاستلام"
      default:
        return method
    }
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-500">جاري تحميل الطلبات...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">الطلبات</h1>
        <p className="text-gray-500">إدارة طلبات العملاء</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 rounded-lg bg-white p-4 shadow md:flex-row md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن طلب..."
            className="w-full rounded-md border border-gray-300 py-2 pr-10 text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-right"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">جميع الحالات</option>
            <option value="paid">مكتمل</option>
            <option value="processing">قيد التجهيز</option>
            <option value="shipping">قيد التوصيل</option>
            <option value="cancelled">ملغي</option>
            <option value="pending">معلق</option>
          </select>

          <button
            className="flex items-center rounded-md border border-gray-300 px-3 py-2"
            onClick={() => {
              setSearchTerm("")
              setStatusFilter("")
            }}
          >
            <Filter className="ml-2 h-5 w-5" />
            <span>إعادة ضبط</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          {filteredOrders.length > 0 ? (
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">رقم الطلب</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">العميل</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">التاريخ</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">المنتجات</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">طريقة الدفع</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">المبلغ</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">الحالة</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                    <td className="whitespace-nowrap px-6 py-4">{order.customer}</td>
                    <td className="whitespace-nowrap px-6 py-4">{order.date.toLocaleDateString("ar-KW")}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">{order.items}</td>
                    <td className="whitespace-nowrap px-6 py-4">{getPaymentMethod(order.paymentMethod)}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">د.ك {order.total.toFixed(3)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                {searchTerm || statusFilter ? "لا توجد طلبات تطابق معايير البحث" : "لا توجد طلبات حتى الآن"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination - simplified for now */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  عرض <span className="font-medium">1</span> إلى{" "}
                  <span className="font-medium">{filteredOrders.length}</span> من{" "}
                  <span className="font-medium">{filteredOrders.length}</span> طلب
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

