import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Answer } from '@/types/community';
import { useNavigate } from 'react-router-dom';

interface AnswerCardProps {
  answer: Answer;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ answer }) => {
  const navigate = useNavigate();
  return (
    <div className=" mb-4">
     <div className='flex items-center gap-4'>
     <Avatar className="h-10 w-10 cursor-pointer" onClick={()=>{
      navigate( answer.author.isOwnAnswer ? `/profile` : `/public-profile/${answer.author.slug}`);
     }}>
        <AvatarImage className='object-cover' src={answer.author.avatarUrl} alt={answer.author.name} />
        <AvatarFallback>{answer.author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div>
          <p className="font-semibold text-gray-900">{answer.author.name}</p>
          <p className="text-sm text-gray-500">{answer.date}</p>
        </div>
      </div>
     </div>
      <p className="text-gray-700 mt-2 text-sm line-clamp-2">{answer.content}</p>

    </div>

  );
};

export default AnswerCard; 