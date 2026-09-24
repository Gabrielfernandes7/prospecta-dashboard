import * as React from "react"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost" | "destructive"
    size?: "default" | "sm" | "lg" | "icon"
  }
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"

    const variants = {
      default: "bg-slate-900 text-white hover:bg-slate-800",
      outline:
        "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
      ghost: "hover:bg-slate-100 text-slate-900",
      destructive: "bg-red-600 text-white hover:bg-red-700",
    }

    const sizes = {
      default: "h-9 px-4",
      sm: "h-8 px-3 text-xs",
      lg: "h-10 px-8",
      icon: "h-9 w-9",
    }

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
          className || ""
        }`}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
