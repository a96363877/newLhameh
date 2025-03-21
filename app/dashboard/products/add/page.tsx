"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { ArrowRight, Upload, X } from "lucide-react"

export default function AddProductPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    featured: false,
    discount: "",
    weight: "",
    unit: "kg",
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files)
    setImages((prev) => [...prev, ...newFiles])

    // Create preview URLs
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
    setImagePreview((prev) => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreview[index])
    setImagePreview((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")

      // Validate form
      if (!formData.name || !formData.price || !formData.category || !formData.stock) {
        setError("يرجى ملء جميع الحقول المطلوبة")
        return
      }

      if (images.length === 0) {
        setError("يرجى إضافة صورة واحدة على الأقل")
        return
      }

      // Generate product ID
      const productId = `PROD-${Date.now()}`

      // Upload images and get URLs
      const imageUrls = []

      for (const image of images) {
        const storageRef = ref(storage, `products/${productId}/${image.name}`)
        await uploadBytes(storageRef, image)
        const url = await getDownloadURL(storageRef)
        imageUrls.push(url)
      }

      // Create product object
      const product = {
        id: productId,
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        stock: Number.parseInt(formData.stock),
        featured: formData.featured,
        discount: formData.discount ? Number.parseFloat(formData.discount) : null,
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
        unit: formData.unit,
        images: imageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Save to Firestore
      const productRef = doc(db, "products", productId)
      await setDoc(productRef, product)

      // Redirect to products page
      router.push("/dashboard/products")
    } catch (err) {
      console.error("Error adding product:", err)
      setError("حدث خطأ أثناء إضافة المنتج. يرجى المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <button onClick={() => router.back()} className="mr-4 flex items-center text-gray-600 hover:text-gray-900">
          <ArrowRight className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">إضافة منتج جديد</h1>
          <p className="text-gray-500">أضف منتجاً جديداً إلى المتجر</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        {error && <div className="mb-6 rounded-md bg-red-50 p-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="mb-2 block font-medium">
                اسم المنتج <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-3 text-right"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="mb-2 block font-medium">
                وصف المنتج
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 p-3 text-right"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="mb-2 block font-medium">
                السعر (د.ك) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.001"
                min="0"
                className="w-full rounded-md border border-gray-300 p-3 text-right"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="mb-2 block font-medium">
                الفئة <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-3 text-right"
                required
              >
                <option value="">اختر الفئة</option>
                <option value="لحم بقري">لحم بقري</option>
                <option value="لحم غنم">لحم غنم</option>
                <option value="دجاج">دجاج</option>
                <option value="أسماك">أسماك</option>
                <option value="منتجات جاهزة">منتجات جاهزة</option>
              </select>
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="mb-2 block font-medium">
                المخزون <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full rounded-md border border-gray-300 p-3 text-right"
                required
              />
            </div>

            {/* Discount */}
            <div>
              <label htmlFor="discount" className="mb-2 block font-medium">
                الخصم (د.ك)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                step="0.001"
                min="0"
                className="w-full rounded-md border border-gray-300 p-3 text-right"
              />
            </div>

            {/* Weight and Unit */}
            <div className="flex gap-4">
              <div className="flex-grow">
                <label htmlFor="weight" className="mb-2 block font-medium">
                  الوزن
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full rounded-md border border-gray-300 p-3 text-right"
                />
              </div>
              <div className="w-1/3">
                <label htmlFor="unit" className="mb-2 block font-medium">
                  الوحدة
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-3 text-right"
                >
                  <option value="kg">كيلوجرام</option>
                  <option value="g">جرام</option>
                  <option value="piece">قطعة</option>
                  <option value="box">صندوق</option>
                </select>
              </div>
            </div>

            {/* Featured */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <label htmlFor="featured" className="mr-2 block font-medium">
                  منتج مميز
                </label>
              </div>
            </div>

            {/* Images */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                صور المنتج <span className="text-red-500">*</span>
              </label>

              <div className="mb-4 grid grid-cols-4 gap-4">
                {imagePreview.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-md border border-gray-200">
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      className="h-full w-full rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400">
                  <Upload className="mb-2 h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500">إضافة صورة</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" multiple />
                </label>
              </div>

              <p className="text-sm text-gray-500">يمكنك إضافة حتى 8 صور. الحد الأقصى لحجم الصورة: 5 ميجابايت.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-4 rounded-md border border-gray-300 px-6 py-2 font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-6 py-2 font-medium text-white"
              disabled={loading}
            >
              {loading ? "جاري الحفظ..." : "حفظ المنتج"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

