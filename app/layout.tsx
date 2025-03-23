import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "المتحدة | United Meat Company",
  description: "شركة المتحدة للحوم والمنتجات الغذائية",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className} style={{zoom:0.9}}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}



import './globals.css'
import { CartProvider } from "./contexts/cart-context"
