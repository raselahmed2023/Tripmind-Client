import { cn } from "@/utils";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  icon?: React.ReactNode;
}

const variantConfig: Record<
  AlertVariant,
  { styles: string; icon: React.ReactNode }
> = {
  info: {
    styles: "bg-blue-50 border-blue-200 text-blue-800",
    icon: <Info className="h-5 w-5 text-blue-500" />,
  },
  success: {
    styles: "bg-green-50 border-green-200 text-green-800",
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
  },
  warning: {
    styles: "bg-amber-50 border-amber-200 text-amber-800",
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  },
  error: {
    styles: "bg-red-50 border-red-200 text-red-800",
    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
  },
};

export function Alert({
  variant = "info",
  title,
  icon,
  children,
  className,
  ...props
}: AlertProps) {
  const config = variantConfig[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex w-full items-start gap-3 rounded-[var(--radius-lg)] border p-4",
        config.styles,
        className
      )}
      {...props}
    >
      <div className="mt-0.5 shrink-0">{icon || config.icon}</div>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold mb-1">{title}</h4>
        )}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
