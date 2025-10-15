import { Card, CardContent } from "./ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "./ui/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-[#2563eb]",
  iconBgColor = "bg-blue-50",
}: MetricCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-[#64748b]">{title}</p>
            <p className="text-[#1e293b]">{value}</p>
            {change && (
              <div
                className={cn(
                  changeType === "positive" && "text-[#10b981]",
                  changeType === "negative" && "text-[#ef4444]",
                  changeType === "neutral" && "text-[#64748b]"
                )}
              >
                {change}
              </div>
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-lg",
              iconBgColor
            )}
          >
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
