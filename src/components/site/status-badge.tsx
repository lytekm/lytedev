import { cn } from "@/lib/utils";

export function StatusBadge({ status, subtle = false }: { status: string; subtle?: boolean }) {
  return (
    <span className={cn("status-badge", subtle && "status-badge--subtle")}>
      <span aria-hidden="true" className="status-badge__dot" />
      {status}
    </span>
  );
}
