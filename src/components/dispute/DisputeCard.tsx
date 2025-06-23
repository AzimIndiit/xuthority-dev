import React from 'react';
import { DisputedReview, Dispute } from '@/types/dispute';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2 } from 'lucide-react';
import StarRating from '../ui/StarRating';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

interface DisputeCardProps {
  review: DisputedReview;
  dispute: Dispute;
}

const statusStyles = {
  Active: 'bg-green-100 text-green-800',
  Resolved: 'bg-blue-100 text-blue-800',
  Dismissed: 'bg-gray-100 text-gray-800',
};

const DisputeCard: React.FC<DisputeCardProps> = ({ review, dispute }) => {
  return (
    <div className="bg-white p-4  rounded-lg border border-gray-200 shadow-sm">
      {/* Review Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">"{review.title}"</h2>
          <div className="flex items-center gap-4 mt-2">
            <StarRating rating={review.rating} />
            <span className="text-gray-600 text-xs sm:text-sm">{review.date}</span>
          </div>
          <p className="text-gray-700 mt-4 text-xs sm:text-sm">{review.content}</p>
        </div>
        <div className="flex gap-2 self-end sm:self-start flex-shrink-0">
          <Button className="bg-blue-600 text-white rounded-full hover:bg-blue-700 px-4 py-2 !text-xs font-semibold flex items-center h-10 sm:h-12">
            <Edit className="w-3 h-3 sm:mr-1 sm:w-4 sm:h-4" />
          <span className="hidden sm:block"> Edit Review</span>
          </Button>
          <Button variant="destructive" className="rounded-full px-4 py-2 !text-xs font-semibold flex items-center h-10 sm:h-12">
            <Trash2 className="w-3 h-3 sm:mr-1 sm:w-4 sm:h-4" />
          <span className="hidden sm:block"> Delete Review</span>
          </Button>

         
        </div>
      </div>

      {/* <hr className="my-8 border-gray-200" /> */}

      {/* Dispute Section */}
      <div className='mt-4'>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Dispute</h3>
        <div className="flex items-center gap-4 mt-4">
          <Avatar className="h-12 w-12 bg-gray-100">
            <AvatarImage src={dispute.disputer.avatarUrl} alt={dispute.disputer.name} />
            <AvatarFallback>{dispute.disputer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900">{dispute.disputer.name}</p>
            <p className="text-sm text-gray-500">{dispute.date}</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">{dispute.reason}</h4>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[dispute.status]}`}>
              {dispute.status}
            </span>
          </div>
          <div className="text-gray-700 mt-2 space-y-2 text-xs sm:text-sm">
            <p>{dispute.explanation}</p>
            <ul className="list-disc list-inside pl-4 ">
              {dispute.claims.map((claim, index) => (
                <li key={index}>{claim}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Add Explanation Section */}
      {dispute.status === 'Active' && <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900">Add Explanation</h3>
        <div className="mt-4 flex flex-col sm:flex-row items-start gap-4">
          <Input
            placeholder="Type here..."
            className="w-full sm:flex-1 rounded-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 h-12"
          />
          <Button className="bg-blue-600 text-white rounded-full hover:bg-blue-700 px-6 py-3 font-semibold self-end sm:self-auto">
            Submit
          </Button>
        </div>
      </div>}
    </div>
  );
};

export default DisputeCard; 