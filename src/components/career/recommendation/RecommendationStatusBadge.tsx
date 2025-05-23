
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: "pending" | "accepted" | "rejected" | "implemented";
};

export function RecommendationStatusBadge({ status }: StatusBadgeProps) {
  switch(status) {
    case 'accepted':
      return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Accepted</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Rejected</Badge>;
    case 'implemented':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Implemented</Badge>;
    default:
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Pending</Badge>;
  }
}
