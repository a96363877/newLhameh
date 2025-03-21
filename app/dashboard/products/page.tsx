"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react"
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { db, storage } from "@/lib/firebase"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const productsCollection = collection(db, "products")
        const productsSnapshot = await getDocs(productsCollection)
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setProducts(productsList)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleDeleteProduct = async (productId, images = []) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        setIsDeleting(true)

        // Delete product document from Firestore
        await deleteDoc(doc(db, "products", productId))

        // Delete product images from Storage
        for (const imageUrl of images) {
          try {
            // Extract the path from the URL
            const imageRef = ref(storage, imageUrl)
            await deleteObject(imageRef)
          } catch (imageError) {
            console.error("Error deleting image:", imageError)
          }
        }

        // Update UI
        setProducts(products.filter((product) => product.id !== productId))
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("حدث خطأ أثناء حذف المنتج")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))]

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-500">جاري تحميل المنتجات...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">المنتجات</h1>
          <p className="text-gray-500">إدارة منتجات المتجر</p>
        </div>

        <Link
          href="/dashboard/products/add"
          className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          <Plus className="ml-2 h-5 w-5" />
          <span>إضافة منتج جديد</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 rounded-lg bg-white p-4 shadow md:flex-row md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن منتج..."
            className="w-full rounded-md border border-gray-300 py-2 pr-10 text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-right"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">جميع الفئات</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            className="flex items-center rounded-md border border-gray-300 px-3 py-2"
            onClick={() => {
              setSearchTerm("")
              setCategoryFilter("")
            }}
          >
            <Filter className="ml-2 h-5 w-5" />
            <span>إعادة ضبط</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          {filteredProducts.length > 0 ? (
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">المنتج</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">الفئة</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">السعر</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">المخزون</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={product.images?.[0] || "/placeholder.svg?height=40&width=40"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="mr-4">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {product.category ? (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                          {product.category}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">د.ك {(product.price || 0).toFixed(3)}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`font-medium ${
                          (product.stock || 0) > 20
                            ? "text-green-600"
                            : (product.stock || 0) > 10
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {product.stock || 0}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Link
                          href={`/dashboard/products/edit/${product.id}`}
                          className="rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          onClick={() => handleDeleteProduct(product.id, product.images)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                {searchTerm || categoryFilter ? "لا توجد منتجات تطابق معايير البحث" : "لا توجد منتجات حتى الآن"}
              </p>
              <Link
                href="/dashboard/products/add"
                className="mt-4 inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-white"
              >
                <Plus className="ml-2 h-5 w-5" />
                <span>إضافة منتج جديد</span>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination - simplified for now */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  عرض <span className="font-medium">1</span> إلى{" "}
                  <span className="font-medium">{filteredProducts.length}</span> من{" "}
                  <span className="font-medium">{filteredProducts.length}</span> منتج
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

