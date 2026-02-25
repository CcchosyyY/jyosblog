interface StatusBadgeProps {
  status: 'active' | 'completed' | 'archived';
}

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    dot: 'bg-status-active animate-pulse',
    badge: 'bg-status-active/10 text-status-active',
  },
  completed: {
    label: 'Completed',
    dot: 'bg-status-completed',
    badge: 'bg-status-completed/10 text-status-completed',
  },
  archived: {
    label: 'Archived',
    dot: 'bg-status-archived',
    badge: 'bg-status-archived/10 text-status-archived',
  },
} as const;

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-caption-sm font-medium ${config.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
