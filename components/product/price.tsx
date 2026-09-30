import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function Price({
  price,
  compareAtPrice,
  className,
}: {
  price: number;
  compareAtPrice?: number;
  className?: string;
}) {
  const onSale = typeof compareAtPrice === "number" && compareAtPrice > price;
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={onSale ? "text-clay-500" : undefined}>{formatPrice(price)}</span>
      {onSale && (
        <span className="text-sm text-ink-100 line-through dark:text-parchment-300">
          {formatPrice(compareAtPrice!)}
        </span>
      )}
    </span>
  );
}
