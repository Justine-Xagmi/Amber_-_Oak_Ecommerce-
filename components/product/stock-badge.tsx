import type { StockStatus } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const CONFIG: Record<StockStatus, { label: string; dot: string; text: string }> = {
  in_stock: { label: "In stock", dot: "bg-success", text: "text-success" },
  low_stock: { label: "Low stock", dot: "bg-brass-400", text: "text-brass-500" },
  out_of_stock: { label: "Out of stock", dot: "bg-danger", text: "text-danger" },
  preorder: { label: "Preorder", dot: "bg-moss-400", text: "text-moss-500" },
};

export function StockBadge({ status, stock }: { status: StockStatus; stock?: number }) {
  const config = CONFIG[status];
  const detail =
    status === "low_stock" && typeof stock === "number" ? ` — only ${stock} left` : "";

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", config.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} aria-hidden="true" />
      {config.label}
      {detail}
    </span>
  );
}
