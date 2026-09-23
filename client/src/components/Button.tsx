import { Link } from "react-router";
import React from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClose?: () => void;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  href,
  className,
  onClose,
  type = "button",
  onClick,
  disabled = false,
}: ButtonProps) {
  const baseStyles = twMerge(
    "rounded-full text-primary-foreground bg-primary whitespace-nowrap inline-flex items-center justify-center gap-2 text-xs py-3 px-9 hover:bg-primary/90 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
    className,
  );

  if (href) {
    return (
      <Link to={href} onClick={onClose} className={baseStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
    >
      {children}
    </button>
  );
}
