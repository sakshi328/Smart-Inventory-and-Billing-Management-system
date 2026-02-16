import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "paid" | "pending" | "overdue" | "low" | "ok";
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles: Record<string, string> = {
    paid: "bg-success/10 text-success border-success/20",
    ok: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    overdue: "bg-destructive/10 text-destructive border-destructive/20",
    low: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Badge variant="outline" className={`${styles[status]} text-xs font-medium capitalize`}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
