import type { KeyMetricItem } from '@/lib/supabase';

interface KeyMetricsProps {
  items: KeyMetricItem[];
}

export default function KeyMetrics({ items }: KeyMetricsProps) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-surface rounded-lg p-4 space-y-1"
        >
          <p className="text-xl font-bold text-primary">{item.value}</p>
          <p className="text-body-sm font-medium text-foreground">
            {item.label}
          </p>
          {item.description && (
            <p className="text-caption-sm text-muted">{item.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
