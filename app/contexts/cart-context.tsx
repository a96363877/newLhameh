"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { v4 as uuidv4 } from "uuid"

// Define types
export type CartItem = {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  visitorId: string
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [visitorId, setVisitorId] = useState<string>("")

  // Initialize visitor ID and load cart from localStorage
  useEffect(() => {
    // Get or create visitor ID
    let visitor = localStorage.getItem("visitorId")
    if (!visitor) {
      visitor = uuidv4()
      localStorage.setItem("visitorId", visitor)
    }
    setVisitorId(visitor)

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }

    // Log visitor data to Firestore
    logVisitorData(visitor)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))

    // Update cart in Firestore if visitor ID exists
    if (visitorId && items.length > 0) {
      updateCartInFirestore()
    }
  }, [items, visitorId])

  // Log visitor data to Firestore
  const logVisitorData = async (visitor: string) => {
    try {
      const visitorRef = doc(db, "visitors", visitor)
      const visitorDoc = await getDoc(visitorRef)

      if (!visitorDoc.exists()) {
        // New visitor
        await setDoc(visitorRef, {
          id: visitor,
          firstVisit: serverTimestamp(),
          lastVisit: serverTimestamp(),
          visits: 1,
          userAgent: navigator.userAgent,
        })
      } else {
        // Returning visitor
        await setDoc(
          visitorRef,
          {
            lastVisit: serverTimestamp(),
            visits: visitorDoc.data().visits + 1,
            userAgent: navigator.userAgent,
          },
          { merge: true },
        )
      }
    } catch (error) {
      console.error("Error logging visitor data:", error)
    }
  }

  // Update cart in Firestore
  const updateCartInFirestore = async () => {
    try {
      const cartRef = doc(db, "carts", visitorId)
      await setDoc(
        cartRef,
        {
          items,
          updatedAt: serverTimestamp(),
          totalItems: totalItems,
          totalPrice: totalPrice,
        },
        { merge: true },
      )
    } catch (error) {
      console.error("Error updating cart in Firestore:", error)
    }
  }

  // Add item to cart
  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)

      if (existingItem) {
        // Item exists, increase quantity
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      } else {
        // New item
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  // Remove item from cart
  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
  }

  // Calculate total items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  // Calculate total price
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        visitorId,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

