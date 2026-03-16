import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "primary" | "accent";
  subtitle?: string;
}

const StatCard = ({ title, value, icon: Icon, variant = "default", subtitle }: StatCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl p-5 transition-all hover:shadow-md",
        variant === "primary" && "stat-card-gradient text-primary-foreground",
        variant === "accent" && "accent-gradient text-accent-foreground",
        variant === "default" && "glass-card"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "opacity-80"
            )}
          >
            {title}
          </p>
          <p className="mt-1 font-display text-3xl">{value}</p>
          {subtitle && (
            <p className={cn("mt-1 text-xs", variant === "default" ? "text-muted-foreground" : "opacity-70")}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            variant === "default" ? "bg-secondary" : "bg-white/20"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
