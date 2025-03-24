import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "./contexts/cart-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "المتحدة | United Meat Company",
  description: "شركة المتحدة للحوم والمنتجات الغذائية",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://unionkw.com/",
    title: "المتحدة | United Meat Company",
    description: "شركة المتحدة للحوم والمنتجات الغذائية",
    siteName: "المتحدة للحوم",
    images: [
      {
        url: "https://unionkw.com/lounited.png", // Path to your OG image in the public directory
        width: 1200,
        height: 630,
        alt: "المتحدة للحوم والمنتجات الغذائية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "المتحدة | United Meat Company",
    description: "شركة المتحدة للحوم والمنتجات الغذائية",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className} style={{ zoom: 0.9 }}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
