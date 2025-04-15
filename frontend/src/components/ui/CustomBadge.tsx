
import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "success" | "warning";
  className?: string;
}

const Badge = ({ children, variant = "default", className }: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-elkaavie-100 text-elkaavie-800": variant === "default",
          "bg-white border border-elkaavie-200 text-elkaavie-700": variant === "outline",
          "bg-green-100 text-green-800": variant === "success",
          "bg-amber-100 text-amber-800": variant === "warning",
        },
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
