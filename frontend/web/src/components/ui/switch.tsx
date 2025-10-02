"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, disabled, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false)

    // Use controlled value if provided, otherwise use internal state
    const switchChecked = checked !== undefined ? checked : isChecked

    const handleClick = () => {
      if (disabled) return

      const newChecked = !switchChecked
      if (checked === undefined) {
        setIsChecked(newChecked)
      }
      onCheckedChange?.(newChecked)
    }

    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={switchChecked}
        data-state={switchChecked ? "checked" : "unchecked"}
        disabled={disabled}
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          switchChecked
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-600/50 hover:bg-gray-500/50",
          className
        )}
        onClick={handleClick}
        type="button"
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-all duration-300",
            switchChecked
              ? "translate-x-4 bg-white"
              : "translate-x-0 bg-gray-300"
          )}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }