import React from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Review } from '@/types/review';
import { VerifiedBadge } from '../icons/VerifiedBadge';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-4 p-6">
        <div className='w-full sm:w-full '>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">"{review.title}"</h3>
          <div className="flex items-center">
            <StarRating rating={review.rating} />
            <span className="text-gray-600 ml-2">{review.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-blue-600 font-medium  w-full sm:w-2/4 lg:w-1/4 sm:justify-end">
          <button className="flex items-center gap-1.5 hover:underline text-red-500">
            <ThumbsUp size={16} />
            Helpful?
          </button>
          <button className="flex items-center gap-1.5 hover:underline">
            <MessageSquare size={16} />
            Add Comment
          </button>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed mb-4 px-6">{review.content}</p>
      <div className="bg-pink-50  p-6 flex  flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex sm:items-center gap-3">
          <div className="relative w-12 h-12">
            <Avatar className='h-10 w-10 sm:w-12 sm:h-12'>
              <AvatarImage src={review.author.avatarUrl} alt={review.author.name} />
              <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {review.author.verified && (
              <VerifiedBadge className="absolute bottom-0 -right-2 w-5 h-5 text-blue-600" />
            )}
          </div>
          <div >
            <p className="font-bold  text-gray-900 text-sm">{review.author.name}</p>
            <p className="text-xs lg:text-sm text-gray-600">{review.author.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {review.tags.map((tag) => (
            <span key={tag} className="text-[10px] lg:text-xs text-gray-600 border border-gray-300 rounded-full px-2 py-1 text-center">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard; 