import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string | number;
  user: string;
  action: string;
  target?: string;
  time: string;
  avatar?: string;
}

interface RecentActivityProps {
  items: ActivityItem[];
  className?: string;
}

export function RecentActivity({ items, className }: RecentActivityProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-6", className)}>
      <h3 className="text-xl font-medium text-foreground mb-6">Recent Activity</h3>
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-start">
            <div className="size-10 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border overflow-hidden">
              {item.avatar ? (
                <img src={item.avatar} alt={item.user} className="size-full object-cover" />
              ) : (
                <span className="text-secondary-foreground font-medium text-sm">
                  {item.user.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-foreground">
                <span className="font-medium">{item.user}</span> {item.action}{" "}
                {item.target && <span className="font-medium">{item.target}</span>}
              </p>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
