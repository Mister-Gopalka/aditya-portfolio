import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F3]">
      <div className="text-center">
        <p className="font-heading text-8xl font-bold text-[#A0281A] mb-4">404</p>
        <h1 className="font-heading text-2xl font-bold text-[#1C0A00] mb-2">Page not found</h1>
        <p className="text-[#1C0A00]/60 mb-8">This page doesn't exist.</p>
        <Link
          href="/"
          className="inline-flex items-center bg-[#1C0A00] text-[#FFF8F3] font-medium px-6 py-3 rounded-full hover:bg-[#A0281A] transition-colors"
        >
          ← Back to work
        </Link>
      </div>
    </div>
  );
}
