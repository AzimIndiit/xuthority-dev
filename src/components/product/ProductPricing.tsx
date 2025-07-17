import React from 'react';
import PricingCard from './PricingCard';
import { Circle, Square, Gem } from 'lucide-react';

const pricingData = [
  {
    planName: 'Basic',
    seats: 'For 3 Seats',
    description: 'For mission-critical applications that are core to your business.',
    price: 'Free',
    features: [
      'Fast, Easy-to-use DNS',
      'Unmetered DDoS Protection',
      'Universal SSL Certificate',
      'Free Managed Ruleset',
    ],
    isPopular: false,
    icon: <Circle className="h-8 w-8 text-blue-600" />,
  },
  {
    planName: 'Pro',
    seats: 'For 3 Seats',
    description: "For professional websites that aren't business-critical.",
    price: '$20',
    features: [
      'Fast, Easy-to-use DNS',
      'Unmetered DDoS Protection',
      'CDN',
      'Universal SSL Certificate',
      'Fast, Easy-to-use DNS',
      'Unmetered DDoS Protection',
      'CDN',
      'Universal SSL Certificate',
    ],
    isPopular: true,
    icon: <Square className="h-8 w-8 text-white" />,
  },
  {
    planName: 'Business',
    seats: 'For 4 Seats',
    description: 'For small businesses operating online.',
    price: '$200',
    features: [
      'Fast, Easy-to-use DNS',
      'Unmetered DDoS Protection',
      'CDN',
      'Universal SSL Certificate',
    ],
    isPopular: false,
    icon: <Gem className="h-8 w-8 text-blue-600" />,
  },
  {
    planName: 'Business',
    seats: 'For 4 Seats',
    description: 'For small businesses operating online.',
    price: '$200',
    features: [
      'Fast, Easy-to-use DNS',
      'Unmetered DDoS Protection',
      'CDN',
      'Universal SSL Certificate',
    ],
    isPopular: false,
    icon: <Gem className="h-8 w-8 text-blue-600" />,
  },
  {
    planName: 'Business',
    seats: 'For 4 Seats',
    description: 'For small businesses operating online.',
    price: '$200',
    features: [
      'Fast, Easy-to-use DNS',
      'Unmetered DDoS Protection',
      'CDN',
      'Universal SSL Certificate',
    ],
    isPopular: false,
    icon: <Gem className="h-8 w-8 text-blue-600" />,
  },
];

const ProductPricing = ({pricing, product}: {pricing: any, product: any}) => {
  console.log('pricing', pricing)
  return (
    <div className="relative  py-10 ">
     
          <h2 className=" text-2xl font-bold tracking-tight text-gray-900">
           {product?.name} Pricing
          </h2>
       
        <div className="flex items-stretch gap-x-4 sm:gap-x-8 overflow-x-auto py-4 custom-scrollbar">
            {pricing?.map((plan: any) => (
            <div key={plan.planName} className="w-80 sm:w-96 flex-shrink-0">
              <PricingCard {...plan} icon={<img src="/svg/pricing.svg" alt="pricing" className="w-10 h-10" />} />
            </div>
          ))}
        </div>
    </div>
  );
};

export default ProductPricing; 