import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 text-sm font-medium transition-[background-color,opacity,transform] duration-150 ease-snap disabled:pointer-events-none disabled:opacity-40 min-h-11",
  {
    variants: {
      variant: {
        primary: "bg-paper text-ink hover:opacity-90",
        ghost: "border-line bg-transparent text-fg hover:bg-subtle",
        quiet: "bg-transparent px-2 text-muted hover:text-fg",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export function Button({
  className,
  variant,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button type={type} className={cn(buttonVariants({ variant }), className)} {...props} />;
}
