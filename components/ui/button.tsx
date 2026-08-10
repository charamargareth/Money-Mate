import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-navy text-white hover:bg-navy-2 shadow-[0_6px_16px_rgba(35,50,74,0.25)]",
        accent: "bg-sky text-navy hover:brightness-95 shadow-[0_6px_16px_rgba(207,235,255,0.4)]",
        cream: "bg-cream text-navy hover:brightness-95 border border-border",
        outline: "border border-border bg-transparent hover:bg-surface-muted text-foreground",
        ghost: "hover:bg-surface-muted text-foreground",
        destructive: "bg-expense text-white hover:brightness-95",
        link: "text-navy dark:text-sky underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-13 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, children, ...props }, ref) => {
    const Comp: any = asChild ? Slot : "button";

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      const target = e.currentTarget;
      const circle = document.createElement("span");
      const diameter = Math.max(target.clientWidth, target.clientHeight);
      const rect = target.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
      circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
      circle.className = "ripple";
      target.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
      onClick?.(e);
    }

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={asChild ? onClick : handleClick}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
