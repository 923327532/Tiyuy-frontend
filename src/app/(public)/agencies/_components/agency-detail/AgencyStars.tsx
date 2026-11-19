import { Star } from 'lucide-react';

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
} as const;

interface AgencyStarsProps {
  value: number;
  size?: keyof typeof SIZES;
}

export default function AgencyStars({ value, size = 'sm' }: AgencyStarsProps) {
  const rounded = Math.round(value);

  return (
    <span aria-hidden="true" className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${SIZES[size]} ${
            star <= rounded
              ? 'fill-amber-400 text-amber-400'
              : 'fill-stone-200 text-stone-200'
          }`}
        />
      ))}
    </span>
  );
}
