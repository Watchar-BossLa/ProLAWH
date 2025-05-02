
import { cn } from "@/lib/utils";
import React from "react";
import { useAccessibility } from "../theme/theme-provider";

interface HighContrastContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function HighContrastContainer({
  children,
  className,
  ...props
}: HighContrastContainerProps) {
  const { highContrast } = useAccessibility();
  
  return (
    <div
      className={cn(
        "p-4 rounded-lg border", 
        "dynamic:gradient-card",
        highContrast ? "high-contrast-border" : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface HighContrastTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function HighContrastText({
  children,
  className,
  ...props
}: HighContrastTextProps) {
  const { highContrast } = useAccessibility();
  
  return (
    <p
      className={cn(
        "text-foreground",
        "dynamic:high-contrast-text",
        highContrast ? "font-medium" : "",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

interface HighContrastHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function HighContrastHeading({
  children,
  className,
  ...props
}: HighContrastHeadingProps) {
  const { highContrast } = useAccessibility();
  
  return (
    <h2
      className={cn(
        "text-xl font-bold text-foreground",
        "dynamic:gradient-text",
        highContrast ? "text-2xl" : "",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

// Additional accessibility components
interface AccessibleLabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  children: React.ReactNode;
}

export function AccessibleLabel({
  children,
  className,
  htmlFor,
  ...props
}: AccessibleLabelProps) {
  const { highContrast } = useAccessibility();
  
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium text-foreground mb-1 block",
        highContrast ? "text-base" : "",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export function AccessibilityToggle() {
  const { highContrast, toggleHighContrast } = useAccessibility();
  
  return (
    <button
      type="button"
      onClick={toggleHighContrast}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        highContrast 
          ? "bg-primary text-primary-foreground" 
          : "bg-accent text-accent-foreground"
      )}
      aria-pressed={highContrast}
    >
      <span className="sr-only">
        {highContrast ? "Disable" : "Enable"} high contrast mode
      </span>
      <Contrast className="h-4 w-4 mr-2" />
      {highContrast ? "Standard Contrast" : "High Contrast"}
    </button>
  );
}
