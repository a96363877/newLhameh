import type React from "react"
import Header from "@/components/layout/header"
import BottomNav from "@/components/layout/bottom-nav"

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <BottomNav />
    </>
  )
}

