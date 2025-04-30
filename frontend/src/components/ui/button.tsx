import * as React from "react";
import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
  createPolymorphicComponent,
} from "@mantine/core";

// Define our custom props without extending MantineButtonProps
export interface CustomButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  // These props are needed for React Router integration
  to?: string;
  // HTML button type attribute
  type?: "button" | "submit" | "reset";
  // Mantine-specific props
  compact?: boolean;
}

// Combine our custom props with Mantine's props
export type ButtonProps = CustomButtonProps &
  Omit<MantineButtonProps, keyof CustomButtonProps>;

// Map our custom variants to Mantine variants
const variantMap = {
  default: "filled",
  destructive: "filled",
  outline: "outline",
  secondary: "light",
  ghost: "subtle",
  link: "transparent",
};

// Map our custom sizes to Mantine sizes
const sizeMap = {
  default: "md",
  sm: "sm",
  lg: "lg",
  icon: "md",
};

// Map our custom colors based on variant
const colorMap = {
  default: "blue",
  destructive: "red",
  outline: "gray",
  secondary: "gray",
  ghost: "gray",
  link: "blue",
};

// Create a base button component
const _Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      className,
      type,
      to, // We'll keep this in the destructuring but handle it differently
      compact,
      ...props
    },
    ref
  ) => {
    // Convert our custom props to Mantine props
    const mantineVariant = variantMap[variant] as MantineButtonProps["variant"];
    const mantineSize = sizeMap[size] as MantineButtonProps["size"];
    const color = colorMap[variant];

    // If 'to' prop is provided, we need to handle it differently
    // The actual routing will be handled by the polymorphic component
    const buttonProps: any = { ...props };
    if (to) {
      // We'll set the component prop to 'a' and href to the 'to' value
      // when using the polymorphic component
      buttonProps.component = "a";
      buttonProps.href = to;
    }

    return (
      <MantineButton
        ref={ref}
        variant={mantineVariant}
        size={mantineSize}
        color={color}
        className={className}
        type={type}
        compact={compact}
        {...buttonProps}
      />
    );
  }
);

_Button.displayName = "Button";

// Create a polymorphic version of the button
const Button = createPolymorphicComponent<"button", ButtonProps>(_Button);

// For compatibility with existing code
const buttonVariants = (options: {
  variant?: CustomButtonProps["variant"];
  size?: CustomButtonProps["size"];
  className?: string;
}) => {
  // This function is kept for API compatibility but doesn't do anything
  // since we're using Mantine's styling system now
  return options.className || "";
};

export { Button, buttonVariants };
