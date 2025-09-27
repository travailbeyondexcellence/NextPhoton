"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  max?: number
  min?: number
  step?: number
  className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, max = 100, min = 0, step = 1, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)
      onValueChange([newValue])
    }

    const percentage = ((value[0] || 0) - min) / (max - min) * 100

    return (
      <div className={cn("relative w-full", className)}>
        {/* Track background */}
        <div className="absolute inset-y-0 w-full flex items-center pointer-events-none">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-150"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        
        {/* Input range */}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0] || 0}
          onChange={handleChange}
          className="relative w-full h-2 bg-transparent appearance-none cursor-pointer slider z-10"
          {...props}
        />
        <style jsx>{`
          .slider {
            background: transparent;
            outline: none;
          }
          
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: rgb(var(--primary));
            cursor: pointer;
            border: 2px solid rgb(var(--background));
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
            position: relative;
            z-index: 2;
          }
          
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: rgb(var(--primary));
            cursor: pointer;
            border: 2px solid rgb(var(--background));
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
            position: relative;
            z-index: 2;
            border: none;
          }
          
          .slider::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
          
          .slider::-webkit-slider-runnable-track {
            height: 8px;
            background: transparent;
            cursor: pointer;
          }
          
          .slider::-moz-range-track {
            height: 8px;
            background: transparent;
            cursor: pointer;
            border: none;
          }
        `}</style>
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }