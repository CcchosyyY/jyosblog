import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = {
  xs: { px: 20, text: 'text-caption-xs' },
  sm: { px: 24, text: 'text-caption-xs' },
  md: { px: 28, text: 'text-caption' },
  lg: { px: 32, text: 'text-caption' },
  xl: { px: 64, text: 'text-heading-md' },
} as const;

export default function Avatar({
  src,
  name,
  size = 'md',
  className = '',
}: AvatarProps) {
  const { px, text } = SIZES[size];
  const initial = name.charAt(0).toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={px}
        height={px}
        className={`rounded-full shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-primary/20 flex items-center justify-center ${text} font-bold text-primary shrink-0 ${className}`}
      style={{ width: px, height: px }}
    >
      {initial}
    </div>
  );
}
