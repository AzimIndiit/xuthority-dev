import React, { useState, useEffect } from 'react';
import { Question } from '@/types/community';
import AnswerCard from './AnswerCard';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import WriteAnswreModal from './WriteAnswreModal';
import { useAnswers, useDeleteQuestion } from '@/hooks/useCommunity';
import { formatDate } from '@/utils/formatDate';
import { getUserDisplayName } from '@/utils/userHelpers';
import LottieLoader from '@/components/LottieLoader';
import useUserStore from '@/store/useUserStore';
import useUIStore from '@/store/useUIStore';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import SecondaryLoader from '../ui/SecondaryLoader';

interface QuestionCardProps {
  question: Question;
}

// Skeleton component for QuestionCard
export const QuestionCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:gap-4">
        <div className="flex-1 mb-4 sm:mb-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-32 mt-2 animate-pulse" />
        </div>
        <div className="flex flex-row-reverse items-center sm:justify-end flex-wrap sm:flex-col justify-between gap-2">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </div>
      
      {/* Answers skeleton */}
      <div className="space-y-4 divide-y divide-gray-200">
        {[1, 2, 3].map((index) => (
          <div key={index} className={index > 0 ? 'pt-4' : ''}>
            <AnswerCardSkeleton />
          </div>
        ))}
      </div>
      
      {/* View all answers button skeleton */}
      <div className="text-center mt-6">
        <div className="h-10 bg-gray-200 rounded-full w-40 mx-auto animate-pulse" />
      </div>
    </div>
  );
};

// Skeleton component for AnswerCard
const AnswerCardSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Author info skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </div>
      
      {/* Answer content skeleton */}
      <div className="space-y-2 pl-13">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
      </div>
    </div>
  );
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [loadedAnswers, setLoadedAnswers] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { user, isLoggedIn } = useUserStore();
  const { openAuthModal } = useUIStore();
  
  const deleteQuestionMutation = useDeleteQuestion();
  
  // Fetch answers when expanded
  const { data: answersData, isLoading: answersLoading } = useAnswers(
    question.id,
    {
      page: 1,
      limit: showAllAnswers ? 50 : 3,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      status: 'approved'
    }
  );

  // Update loaded answers when data changes
  useEffect(() => {
    if (answersData?.answers) {
      setLoadedAnswers(answersData.answers);
    }
  }, [answersData]);

  const handleWriteAnswer = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = async () => {
    try {
      await deleteQuestionMutation.mutateAsync(question.id);
    } catch (error) {
      console.error('Failed to delete question:', error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // Transform API answers to match UI structure
  const transformedAnswers = loadedAnswers.map((answer: any) => ({
    id: answer._id,
    author: {
      name: getUserDisplayName(answer.author),
      avatarUrl: answer.author.avatar || `https://ui-avatars.com/api/?name=${getUserDisplayName(answer.author)}`,
      isVendor: false, // Role is not populated in the answer response, would need backend update
      slug: answer.author.slug,
      _id: answer.author._id,
      isOwnAnswer: answer.author._id === user?._id
    },
    date: formatDate(answer.createdAt),
    content: answer.content
  }));


  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:gap-4">
        <div className="flex-1 mb-4 sm:mb-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900">Q. {question.question}</h3>
            {question.isOwnQuestion && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Your Question
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{question.date}</p>
        </div>
      <div className='flex flex-row-reverse items-center sm:justify-end   flex-wrap sm:flex-col justify-between gap-2'>
      {question.isOwnQuestion && (
          <Button 
            variant="destructive" 
            className="rounded-full self-end sm:self-auto px-4 py-2 text-sm font-semibold h-8 w-8 sm:w-fit"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteQuestionMutation.isPending}
          >
            <Trash2 className="w-2 h-2 " />
            <span className='hidden sm:block text-xs'>
              {deleteQuestionMutation.isPending ? 'Deleting...' : 'Delete Question'}
            </span>
          </Button>
        )}
          <Button 
            onClick={handleWriteAnswer} 
            variant="link" 
            className="text-blue-600 font-semibold whitespace-nowrap p-0 !text-sm h-8 underline"
          >
            Write Your Answers
          </Button>
      </div>
      </div>
      
      {answersLoading && transformedAnswers.length === 0 ? (
        // Show answer skeletons while loading
        <div className="space-y-4 divide-y divide-gray-200">
          {[1, 2, 3].map((index) => (
            <div key={index} className={index > 0 ? 'pt-4' : ''}>
              <AnswerCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4 divide-y divide-gray-200">
            {transformedAnswers.slice(0, showAllAnswers ? undefined : 3).map((answer, index) => (
              <div key={answer.id} className={index > 0 ? '' : ''}>
                <AnswerCard answer={answer} />
              </div>
            ))}
          </div>
          
        
          
          {question.totalAnswers > 3 && !showAllAnswers && (
            <div className="text-center mt-6">
              <Button 
                variant="outline" 
                className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600 text-xs h-10"
                onClick={() => setShowAllAnswers(true)}
              >
                View All Answers
              </Button>
            </div>
          )}
          
          {showAllAnswers && question.totalAnswers > 3 && (
            <div className="text-center mt-6">
              <Button 
                variant="outline" 
                className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600 text-xs h-10"
                onClick={() => setShowAllAnswers(false)}
              >
                Show Less
              </Button>
            </div>
          )}
        </>
      )}
      
      <WriteAnswreModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        questionId={question.id}
      />
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={(open) => {
          if (!deleteQuestionMutation.isPending) {
            setIsDeleteModalOpen(open);
          }
        }}
        onConfirm={handleDeleteQuestion}
        title="Delete Question"
        description="Are you sure you want to delete this question? All answers will also be deleted. This action cannot be undone."
        confirmText={deleteQuestionMutation.isPending ? "Deleting..." : "Delete"}
        confirmVariant="destructive"
      />
    </div>
  );
};

export default QuestionCard; 