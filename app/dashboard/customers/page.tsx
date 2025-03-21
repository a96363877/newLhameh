"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Mail } from "lucide-react"
import { collection, getDocs, query } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true)

        // Fetch visitors (unique customers)
        const visitorsQuery = query(collection(db, "visitors"))
        const visitorsSnapshot = await getDocs(visitorsQuery)
        const visitorsList = visitorsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Fetch orders to get customer spending data
        const ordersQuery = query(collection(db, "orders"))
        const ordersSnapshot = await getDocs(ordersQuery)
        const orders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Process customer data
        const customerData = visitorsList.map((visitor) => {
          // Find orders for this visitor
          const customerOrders = orders.filter((order) => order.visitorId === visitor.id)

          // Calculate total spent and get last order date
          const totalSpent = customerOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
          const orderDates = customerOrders.filter((order) => order.createdAt).map((order) => order.createdAt.toDate())
          const lastOrderDate =
            orderDates.length > 0 ? new Date(Math.max(...orderDates.map((date) => date.getTime()))) : null

          // Get customer info from the most recent order
          const latestOrder = customerOrders.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0
            return b.createdAt.toDate() - a.createdAt.toDate()
          })[0]

          return {
            id: visitor.id,
            name: latestOrder?.customer?.fullName || "زائر",
            email: latestOrder?.customer?.email || "",
            phone: latestOrder?.customer?.phone || "",
            orders: customerOrders.length,
            totalSpent: totalSpent,
            lastOrder: lastOrderDate,
            status: customerOrders.length > 0 ? "active" : "inactive",
            firstVisit: visitor.firstVisit?.toDate() || new Date(),
            lastVisit: visitor.lastVisit?.toDate() || new Date(),
            visits: visitor.visits || 1,
          }
        })

        // Sort by most recent order
        customerData.sort((a, b) => {
          if (!a.lastOrder && !b.lastOrder) return 0
          if (!a.lastOrder) return 1
          if (!b.lastOrder) return -1
          return b.lastOrder - a.lastOrder
        })

        setCustomers(customerData)
      } catch (error) {
        console.error("Error fetching customers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // Filter customers based on search term and status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-500">جاري تحميل بيانات العملاء...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">العملاء</h1>
        <p className="text-gray-500">إدارة حسابات العملاء</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 rounded-lg bg-white p-4 shadow md:flex-row md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن عميل..."
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
            <option value="">جميع العملاء</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
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

      {/* Customers Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          {filteredCustomers.length > 0 ? (
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">العميل</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">البريد الإلكتروني</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">رقم الهاتف</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">الطلبات</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">إجمالي الإنفاق</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">آخر طلب</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">الحالة</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{customer.email || "-"}</td>
                    <td className="whitespace-nowrap px-6 py-4">{customer.phone || "-"}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">{customer.orders}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">د.ك {customer.totalSpent.toFixed(3)}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {customer.lastOrder ? customer.lastOrder.toLocaleDateString("ar-KW") : "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {customer.status === "active" ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          نشط
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                          غير نشط
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <button className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100">
                          <Eye className="h-5 w-5" />
                        </button>
                        {customer.email && (
                          <button className="rounded-md bg-green-50 p-2 text-green-600 hover:bg-green-100">
                            <Mail className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                {searchTerm || statusFilter ? "لا يوجد عملاء يطابقون معايير البحث" : "لا يوجد عملاء حتى الآن"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination - simplified for now */}
        {filteredCustomers.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  عرض <span className="font-medium">1</span> إلى{" "}
                  <span className="font-medium">{filteredCustomers.length}</span> من{" "}
                  <span className="font-medium">{filteredCustomers.length}</span> عميل
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

