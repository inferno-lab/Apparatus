import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "./cn"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full border border-[#26364f] bg-[#0f1828] shadow-[inset_0_1px_2px_rgba(0,0,0,0.55)]">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-[linear-gradient(90deg,#1f8dff_0%,#43c0ff_100%)] shadow-[0_0_8px_rgba(56,160,255,0.45)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-[#7fc2ff] bg-[#d9ecff] shadow-[0_0_10px_rgba(56,160,255,0.6)] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#43c0ff] disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
