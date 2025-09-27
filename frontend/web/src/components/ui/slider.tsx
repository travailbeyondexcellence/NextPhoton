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

    return (
      <div className={cn("relative w-full", className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0] || 0}
          onChange={handleChange}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
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
          }
          
          .slider::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
          
          .slider::-webkit-slider-runnable-track {
            height: 8px;
            background: rgba(var(--primary), 0.1);
            border: 1px solid rgba(var(--primary), 0.2);
            border-radius: 4px;
            cursor: pointer;
          }
          
          .slider::-moz-range-track {
            height: 8px;
            background: rgba(var(--primary), 0.1);
            border: 1px solid rgba(var(--primary), 0.2);
            border-radius: 4px;
            cursor: pointer;
          }
          
          .slider::-webkit-slider-runnable-track {
            background: linear-gradient(to right, 
              rgb(var(--primary)) 0%, 
              rgb(var(--primary)) ${((value[0] || 0) - min) / (max - min) * 100}%, 
              rgba(var(--primary), 0.1) ${((value[0] || 0) - min) / (max - min) * 100}%,
              rgba(var(--primary), 0.1) 100%
            );
          }
        `}</style>
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }