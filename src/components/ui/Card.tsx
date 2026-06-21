import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface rounded-xl border-2 border-border p-6",
          hoverEffect ? "neo-brutalist-shadow hover:neo-brutalist-shadow-hover transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1" : "",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export { Card };
