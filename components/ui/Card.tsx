import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = "", hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl p-6 md:p-8
        bg-[#FFF8F3] border border-[#1C0A00]/10
        shadow-md
        ${hover ? "cursor-pointer hover:-translate-y-1 transition-all duration-200" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
