interface FullPageLoaderProps {
  text?: string;
  subText?: string;
}

export default function FullPageLoader({
  text = 'جاري التحميل',
  subText = 'يرجى الانتظار...',
}: FullPageLoaderProps) {
  return (
    <div
      className="fixed inset-0 bg-[#002B7F] flex flex-col items-center justify-center z-50"
      dir="rtl"
    >
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute inset-0 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-blue-200 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
        <div className="absolute inset-4 border-4 border-blue-100 border-l-transparent rounded-full animate-spin animation-delay-300"></div>
      </div>
      {text && <h2 className="text-white text-xl font-bold mb-2">{text}</h2>}
      {subText && <p className="text-blue-200">{subText}</p>}
    </div>
  );
}
