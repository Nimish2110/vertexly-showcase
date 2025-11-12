import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "google" | "primary" | "outline";
  children: ReactNode;
  icon?: ReactNode;
}

const AuthButton = ({ variant = "primary", children, icon, className, ...props }: AuthButtonProps) => {
  const baseStyles = "w-full h-12 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2";
  
  const variantStyles = {
    google: "bg-background border-2 border-input hover:border-primary hover:bg-muted text-foreground",
    primary: "gradient-cta text-white hover:opacity-90 hover:shadow-lg hover:scale-[1.02]",
    outline: "bg-transparent border-2 border-input hover:border-primary hover:bg-muted text-foreground"
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

export default AuthButton;
