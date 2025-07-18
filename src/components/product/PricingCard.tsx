import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatCurrency';
import ReadMoreText from '@/components/ui/ReadMoreText';

interface PricingCardProps {
  name: string;
  seats: string;
  description: string;
  price: string;
  priceInterval?: string;
  features: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
  product: any;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  seats,
  description,
  price,
  priceInterval = '/monthly',
  features,
  isPopular = false,
  icon,
  product,
}) => {
  return (
    <div
      className={cn(
        'relative flex h-full flex-col rounded-2xl p-8 shadow-lg border border-gray-200',
        isPopular ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'
      )}
    >
      {isPopular && (
        <div className="absolute top-0 right-8 -mt-3">
          <div className="inline-block rounded-full bg-white px-4 py-1 text-sm font-semibold text-blue-600 shadow-md">
            Popular
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-lg",
            isPopular ? "bg-white" : "bg-blue-100"
        )}>
          {icon}
        </div>
        <div>
          <p className={cn("text-sm font-medium", isPopular ? "text-blue-200" : "text-gray-500")}>For {seats} Seats</p>
           <h3 className="text-2xl font-bold">{name}</h3>
        </div>
      </div>

      <div className="mt-6">
        <ReadMoreText
          content={description}
          maxLines={3}
          className={cn('text-base leading-relaxed', isPopular ? 'text-blue-100' : 'text-gray-600')}
          buttonClassName={cn(
            isPopular ? "text-blue-200 hover:text-white" : "text-blue-600 hover:text-blue-800"
          )}
        />
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-5xl font-bold tracking-tight">
            {formatCurrency(Number(price))}
        </span>
        {price !== 'Free' && <span className={cn(isPopular ? 'text-blue-200' : 'text-gray-500')}>{priceInterval}</span>}
      </div>

      <p className="mt-8 text-base font-semibold">What's included</p>

      <ul className="mt-4 flex-1 space-y-3">
        {features?.map((feature: any, index: any) => (
          <li key={index} className="flex items-center gap-3">
            <CheckCircle2 className={cn("h-6 w-6 flex-shrink-0", isPopular ? "text-white" : "text-blue-600")} />
            <span className='text-sm'>{feature.value}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Button
          onClick={() => window.open(`https://${product.website}`, '_blank')}
          className={cn(
            'w-full rounded-full py-3 text-base font-semibold transition-transform duration-200 hover:scale-105',
            isPopular
              ? 'bg-white text-blue-600 hover:bg-gray-100'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          Try For Free
        </Button>
      </div>
    </div>
  );
};

export default PricingCard; 