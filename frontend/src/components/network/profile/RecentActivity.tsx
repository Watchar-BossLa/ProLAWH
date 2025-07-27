
interface ActivityItem {
  content: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="space-y-2">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
          <div>
            <p className="text-sm">{activity.content}</p>
            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
