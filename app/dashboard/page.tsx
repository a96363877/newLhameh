"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Users, CreditCard, TrendingUp } from "lucide-react"
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
  })
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [
      {
        label: "المبيعات",
        data: [],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  })
  const [ordersData, setOrdersData] = useState({
    labels: [],
    datasets: [
      {
        label: "الطلبات",
        data: [],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderWidth: 0,
      },
    ],
  })
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [
      {
        label: "المبيعات حسب الفئة",
        data: [],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(139, 92, 246, 0.7)",
        ],
      },
    ],
  })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)

        // Get date for last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const thirtyDaysAgoTimestamp = Timestamp.fromDate(thirtyDaysAgo)

        // Fetch orders
        const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"))
        const ordersSnapshot = await getDocs(ordersQuery)
        const orders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Calculate total sales
        const totalSales = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)

        // Get recent orders for table
        const recentOrdersData = orders.slice(0, 5).map((order:any) => ({
          id: order.id,
          customer: order.customer?.fullName || "عميل",
          items: order.items?.length || 0,
          total: order.totalPrice || 0,
          status: order.status || "pending",
          date: order.createdAt ? new Date(order.createdAt.toDate()) : new Date(),
        }))

        // Fetch customers (unique visitor IDs)
        const visitorsQuery = query(collection(db, "visitors"))
        const visitorsSnapshot = await getDocs(visitorsQuery)
        const totalCustomers = visitorsSnapshot.size

        // Calculate conversion rate (orders / visitors)
        const conversionRate = totalCustomers > 0 ? ((orders.length / totalCustomers) * 100).toFixed(1) : 0

        // Fetch products for category data
        const productsQuery = query(collection(db, "products"))
        const productsSnapshot = await getDocs(productsQuery)
        const products = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Group products by category
        const categories = {}
        products.forEach((product) => {
          const category = product.category || "أخرى"
          if (!categories[category]) {
            categories[category] = 0
          }
          categories[category]++
        })

        // Prepare category chart data
        const categoryLabels = Object.keys(categories)
        const categoryValues = Object.values(categories)

        // Prepare monthly data for charts
        const months = [
          "يناير",
          "فبراير",
          "مارس",
          "أبريل",
          "مايو",
          "يونيو",
          "يوليو",
          "أغسطس",
          "سبتمبر",
          "أكتوبر",
          "نوفمبر",
          "ديسمبر",
        ]
        const currentMonth = new Date().getMonth()

        // Get last 6 months
        const last6Months = []
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12
          last6Months.push(months[monthIndex])
        }

        // Group orders by month
        const ordersByMonth = {}
        const salesByMonth = {}

        last6Months.forEach((month) => {
          ordersByMonth[month] = 0
          salesByMonth[month] = 0
        })

        orders.forEach((order) => {
          if (order.createdAt) {
            const orderDate = order.createdAt.toDate()
            const monthName = months[orderDate.getMonth()]

            if (last6Months.includes(monthName)) {
              ordersByMonth[monthName]++
              salesByMonth[monthName] += order.totalPrice || 0
            }
          }
        })

        // Update state with real data
        setStats({
          totalSales,
          totalOrders: orders.length,
          totalCustomers,
          conversionRate,
        })

        setSalesData({
          labels: last6Months,
          datasets: [
            {
              label: "المبيعات",
              data: last6Months.map((month) => salesByMonth[month]),
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 2,
              fill: true,
            },
          ],
        })

        setOrdersData({
          labels: last6Months,
          datasets: [
            {
              label: "الطلبات",
              data: last6Months.map((month) => ordersByMonth[month]),
              backgroundColor: "rgba(16, 185, 129, 0.7)",
              borderWidth: 0,
            },
          ],
        })

        setCategoryData({
          labels: categoryLabels,
          datasets: [
            {
              label: "المنتجات حسب الفئة",
              data: categoryValues,
              backgroundColor: [
                "rgba(59, 130, 246, 0.7)",
                "rgba(16, 185, 129, 0.7)",
                "rgba(245, 158, 11, 0.7)",
                "rgba(239, 68, 68, 0.7)",
                "rgba(139, 92, 246, 0.7)",
              ],
            },
          ],
        })

        setRecentOrders(recentOrdersData as any)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-500">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-gray-500">مرحباً بك في لوحة تحكم شركة المتحدة للحوم</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي المبيعات"
          value={`د.ك ${stats.totalSales.toFixed(3)}`}
          description="آخر 30 يوم"
          icon={<CreditCard className="h-6 w-6" />}
        />
        <StatCard
          title="الطلبات"
          value={stats.totalOrders}
          description="إجمالي الطلبات"
          icon={<ShoppingBag className="h-6 w-6" />}
        />
        <StatCard
          title="العملاء"
          value={stats.totalCustomers}
          description="إجمالي العملاء"
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="معدل التحويل"
          value={`${stats.conversionRate}%`}
          description="الطلبات / الزيارات"
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <DashboardChart title="المبيعات الشهرية" type="line" data={salesData} />
        <DashboardChart title="الطلبات الشهرية" type="bar" data={ordersData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <DashboardChart title="المنتجات حسب الفئة" type="doughnut" data={categoryData} height={250} />
        </div>

        <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
          <h3 className="mb-4 text-lg font-medium">أحدث الطلبات</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 pl-4 pr-6 text-sm font-medium text-gray-500">رقم الطلب</th>
                  <th className="pb-3 px-4 text-sm font-medium text-gray-500">العميل</th>
                  <th className="pb-3 px-4 text-sm font-medium text-gray-500">المنتجات</th>
                  <th className="pb-3 px-4 text-sm font-medium text-gray-500">المبلغ</th>
                  <th className="pb-3 px-4 text-sm font-medium text-gray-500">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200">
                      <td className="py-4 pl-4 pr-6">#{order.id}</td>
                      <td className="px-4 py-4">{order.customer}</td>
                      <td className="px-4 py-4">{order.items}</td>
                      <td className="px-4 py-4">د.ك {order.total.toFixed(3)}</td>
                      <td className="px-4 py-4">{getStatusBadge(order.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      لا توجد طلبات حتى الآن
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

