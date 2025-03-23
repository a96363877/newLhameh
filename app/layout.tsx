import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "المتحدة | United Meat Company",
  description: "شركة المتحدة للحوم والمنتجات الغذائية",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={inter.className} style={{zoom:0.8}}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}



import './globals.css'
import { CartProvider } from "./contexts/cart-context"
