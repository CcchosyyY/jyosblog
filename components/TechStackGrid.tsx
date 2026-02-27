import type { TechStackItem } from '@/lib/supabase';

interface TechStackGridProps {
  items: TechStackItem[];
}

export default function TechStackGrid({ items }: TechStackGridProps) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.name}
          className="flex items-center gap-2.5 bg-surface rounded-lg p-3"
        >
          <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
            {item.icon || item.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-body-sm font-medium text-foreground truncate">
              {item.name}
            </p>
            {item.category && (
              <p className="text-caption-sm text-muted truncate">
                {item.category}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
