"use client"

import { useState, useEffect, useRef } from "react"
import { Check, X } from 'lucide-react'

interface OtpDialogProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (otp: string) => void
  phoneNumber?: string
  isVerifying?: boolean
}

export default function OtpDialog({ 
  isOpen, 
  onClose, 
  onVerify, 
  phoneNumber = "******1234", 
  isVerifying = false 
}: OtpDialogProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [timeLeft, setTimeLeft] = useState(60)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setOtp(Array(6).fill(""))
      setTimeLeft(60)
      setError(null)
      // Focus first input when dialog opens
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus()
        }
      }, 100)
    }
  }, [isOpen])

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(0, 1)
    setOtp(newOtp)
    setError(null)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle key down
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)
      
      // Focus last input
      inputRefs.current[5]?.focus()
    }
  }

  // Handle verification
  const handleVerify = () => {
    const otpString = otp.join("")
    
    if (otpString.length !== 6) {
      setError("يرجى إدخال رمز التحقق المكون من 6 أرقام")
      return
    }
    
    onVerify(otpString)
  }

  // Handle resend
  const handleResend = () => {
    setTimeLeft(60)
    // Here you would typically call an API to resend the OTP
    // For now, we'll just reset the timer
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg" dir="rtl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">التحقق من الدفع</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6 text-gray-600">
          <p>لقد أرسلنا رمز التحقق إلى رقم الهاتف {phoneNumber}</p>
          <p className="mt-2">يرجى إدخال الرمز المكون من 6 أرقام للتحقق من عملية الدفع</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="h-12 w-12 rounded-md border border-gray-300 text-center text-lg font-bold"
                maxLength={1}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            ))}
          </div>
          
          {error && (
            <p className="mt-2 text-center text-sm text-red-500">{error}</p>
          )}
        </div>
        
        <div className="mb-6 flex justify-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-500">
              إعادة إرسال الرمز بعد {timeLeft} ثانية
            </p>
          ) : (
            <button 
              onClick={handleResend}
              className="text-sm font-medium text-blue-500 hover:text-blue-600"
            >
              إعادة إرسال الرمز
            </button>
          )}
        </div>
        
        <button
          onClick={handleVerify}
          disabled={isVerifying || otp.join("").length !== 6}
          className="flex w-full items-center justify-center rounded-md bg-blue-500 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isVerifying ? (
            <span>جاري التحقق...</span>
          ) : (
            <span className="flex items-center">
              تأكيد <Check className="mr-2 h-4 w-4" />
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
