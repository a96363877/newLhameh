import Image from "next/image"
import Link from "next/link"
import { Search, Menu, User, Heart } from "lucide-react"

export default function Header() {
  return (
    <>
      {/* Header */}
      <header className="bg-blue-500 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="relative">
                <Link href="/account">
                  <User className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs text-blue-500">
                    0
                  </span>
                </Link>
              </div>
              <div className="relative">
                <Link href="/favorites">
                  <Heart className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs text-blue-500">
                    0
                  </span>
                </Link>
              </div>
            </div>

            <Link href="/" className="flex items-center">
              <Image src="/logoo.png" alt="المتحدة" width={120} height={40} className="h-10 w-auto" />
            </Link>

            <button className="p-1">
              <Menu className="h-8 w-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-blue-500 px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="البحث عن أسم المنتج او التصنيف..."
            className="w-full rounded-md border-0 py-3 pe-4 ps-10 text-right"
            dir="rtl"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </>
  )
}

