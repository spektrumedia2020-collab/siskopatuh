import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    // UNIFIED THEME CONFIGURATION
    const variants = {
      default: "theme-primary-bg theme-button-text hover:opacity-90 shadow-lg font-bold border-transparent transition-all",
      outline: "border-2 !border-[var(--theme-primary)] bg-transparent hover:theme-primary-bg !text-[var(--theme-primary)] hover:!text-[var(--theme-text-button)] transition-all font-bold",
      ghost: "hover:theme-primary-bg !text-[var(--theme-text-title)] hover:!text-[var(--theme-text-button)] transition-all font-bold",
      secondary: "bg-black/20 !text-[var(--theme-text-title)] hover:bg-black/40 transition-all font-bold",
      destructive: "bg-rose-600 text-white hover:bg-rose-500 shadow-lg font-bold transition-all",
      link: "!text-[var(--theme-primary)] underline-offset-4 hover:underline font-bold transition-all",
    }
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-11 rounded-md px-8 text-base",
      icon: "h-10 w-10",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          // We strip out hardcoded overrides from className if they conflict, or let them override.
          // Since the user wants to REMOVE hardcoded button styles, we can actually filter them out from \`className\`!
          className?.replace(/bg-(blue|emerald|rose|amber|white|slate)-[0-9]{3}(\/[0-9]+)?/g, '')
                   .replace(/text-(blue|emerald|rose|amber|white|slate)-[0-9]{3}(\/[0-9]+)?/g, '')
                   .replace(/hover:bg-(blue|emerald|rose|amber|white|slate)-[0-9]{3}(\/[0-9]+)?/g, '')
                   .replace(/theme-primary-bg/g, '')
                   .replace(/shadow-lg/g, '')
                   .replace(/border-transparent/g, '')
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
