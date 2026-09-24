import * as React from "react"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-slate-200 bg-slate-100 text-slate-900",
    secondary: "border-slate-300 bg-slate-200 text-slate-800",
    destructive: "border-red-300 bg-red-100 text-red-900",
    outline: "border-slate-200 text-slate-900",
  }

  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${
        className || ""
      }`}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export { Badge }
