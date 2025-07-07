import React from 'react';
import StarRating from '@/components/ui/StarRating';
import { cn } from '@/lib/utils';

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

interface RatingBreakdownProps {
  rating: number;
  reviewCount: number;
  ratingDistribution: RatingDistribution[];
  onFilterChange: (stars: number) => void;
  filters: {
    overallRating: number;
    page: number;
    limit: number;
  };
}

const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  filters,
  rating,
  reviewCount,
  ratingDistribution,
  onFilterChange,
}) => {
  return (
    <div className=" px-6 py-8 rounded-lg flex flex-col lg:flex-row gap-6 items-center justify-between bg-white h-full">
    <div className='w-full lg:w-50'>
    <h3 className="text-lg font-bold text-gray-900 mb-1">Reviews</h3>
      <div className="flex lg:flex-col flex-row lg:items-start items-center mb-4 gap-3">
        <p className="text-5xl font-bold text-gray-900">{rating.toFixed(1)}</p>
        <div className="ml-4 lg:ml-0">
          <StarRating rating={rating} starClassName="w-6 h-6" />
          <p className="text-sm text-gray-600 mt-1">({reviewCount} Reviews)</p>
        </div>
      </div>
    </div>
      <div className="space-y-2 w-full ">
        {ratingDistribution.map((item) => (
          <div
            key={item.stars}
            className={cn("flex items-center group cursor-pointer p-1 rounded-lg hover:bg-gray-100", filters.overallRating === item.stars && "bg-gray-100")}
            onClick={() =>{
             if(filters.overallRating === item.stars){
              onFilterChange(null);
             }else{
              onFilterChange(item.stars);
             }
            }}
          >
            <span className={cn("text-sm text-gray-600 w-16 sm:w-14 group-hover:underline", filters.overallRating === item.stars && "text-red-600")}>{item.stars} star{item.stars > 1 ? 's' : ''}</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mx-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
            </div>
            <span className={cn("text-sm text-gray-600 w-10 text-right group-hover:underline", filters.overallRating === item.stars && "text-red-600")}>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingBreakdown; 