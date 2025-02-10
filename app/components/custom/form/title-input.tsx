import * as React from "react";
import { cn } from "~/lib/utils";

export interface TitleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const TitleInput = React.forwardRef<HTMLInputElement, TitleInputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full p-1 text-xl bg-white dark:bg-gray-800 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        defaultValue="Untitled Assignment"
        {...props}
      />
    );
  }
);
TitleInput.displayName = "Input";

export { TitleInput };
