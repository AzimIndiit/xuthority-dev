import React, { useState } from 'react';
import { MyAnswer } from '@/types/community';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import ConfirmationModal from '../ui/ConfirmationModal';
import { useDeleteAnswer } from '@/hooks/useCommunity';
import { formatDate } from '@/utils/formatDate';
import WriteAnswreModal from '@/components/product/WriteAnswreModal';

interface MyAnswerCardProps {
  myAnswer: MyAnswer;
}

// Skeleton component for MyAnswerCard
export const MyAnswerCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex flex-col justify-between sm:items-start">
        <div className="flex justify-between w-full">
          <div className="flex-1">
            {/* Question skeleton */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="flex items-center gap-2 justify-between">
              {/* Date skeleton */}
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
              {/* Mobile buttons skeleton */}
              <div className="gap-2 self-end sm:self-start flex-shrink-0 flex sm:hidden">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          {/* Desktop buttons skeleton */}
          <div className="gap-2 self-end sm:self-start flex-shrink-0 hidden sm:flex">
            <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-8 w-28 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Answer content skeleton */}
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const MyAnswerCard: React.FC<MyAnswerCardProps> = ({ myAnswer }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showReadMore, setShowReadMore] = React.useState(false);
  const contentRef = React.useRef<HTMLParagraphElement>(null);
  
  const deleteAnswerMutation = useDeleteAnswer();

  React.useEffect(() => {
    const checkTruncation = () => {
      if (contentRef.current) {
        // Temporarily remove truncation to measure full height
        const element = contentRef.current;
        const originalStyle = element.style.cssText;
        
        // Set to full display to measure actual height
        element.style.display = 'block';
        element.style.webkitLineClamp = 'none';
        element.style.overflow = 'visible';
        element.style.whiteSpace = 'pre-line';
        
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 20;
        const maxHeight = lineHeight * 4; // 4 lines
        const actualHeight = element.scrollHeight;
        
        // Restore original style
        element.style.cssText = originalStyle;
        
        setShowReadMore(actualHeight > maxHeight);
      }
    };

    // Use setTimeout to ensure the content is rendered
    const timer = setTimeout(checkTruncation, 0);
    return () => clearTimeout(timer);
  }, [myAnswer.answerContent]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = async () => {
    if (!myAnswer.answerId) return;
    
    try {
      await deleteAnswerMutation.mutateAsync(myAnswer.answerId);
      // Modal will close automatically on success
      // The mutation hook should handle the success toast
    } catch (error) {
      // Error is handled by the mutation hook with toast notification
      console.error('Failed to delete answer:', error);
    } finally {
      // Always close the modal
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col justify-between sm:items-start ">
          <div className="flex justify-between w-full">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Q. {myAnswer.question}</h3>
              <div className="flex items-center gap-2 justify-between">
                <p className="text-sm text-gray-500 mt-1">{formatDate(myAnswer.questionDate)}</p>
                <div className=" gap-2 self-end sm:self-start flex-shrink-0 flex sm:hidden">
                  <Button 
                    className="bg-blue-600 text-white rounded-full hover:bg-blue-700 px-4 py-2 !text-xs flex items-center h-8 w-8 sm:w-fit"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit className="w-2 h-2" />
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-full px-4 py-2 !text-xs  text-white flex items-center h-8 w-8 sm:w-fit"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={deleteAnswerMutation.isPending}
                    title="Delete Answer"
                    loading={deleteAnswerMutation.isPending}
                  >
                   
                      <Trash2 className="w-2 h-2" />
                  </Button>
                </div>
              </div>
            </div>
            <div className=" gap-2 self-end sm:self-start flex-shrink-0 hidden sm:flex">
                              <Button 
                  className="bg-blue-600 text-white rounded-full hover:bg-blue-700 px-4 py-2 !text-xs flex items-center h-8 w-8 sm:w-fit"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="w-2 h-2 sm:mr-1" />
                  <span className="hidden sm:block">Edit Answer</span>
                </Button>
                              <Button
                  variant="destructive"
                  className="rounded-full px-4 py-2 !text-xs  text-white flex items-center h-8 w-8 sm:w-fit"
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={deleteAnswerMutation.isPending}
                  title="Delete Answer"
                  loading={deleteAnswerMutation.isPending}
                >
                 
                    <Trash2 className="w-2 h-2 sm:mr-1" />
                 
                  <span className="hidden sm:block">
                    {deleteAnswerMutation.isPending ? 'Deleting...' : 'Delete Answer'}
                  </span>
                </Button>
            </div>
          </div>
          
          <p 
            ref={contentRef}
            className="text-gray-700 mt-4 text-sm  whitespace-pre-line"
            style={{
              display: !isExpanded && showReadMore ? '-webkit-box' : 'block',
              WebkitLineClamp: !isExpanded && showReadMore ? 4 : 'none',
              WebkitBoxOrient: 'vertical' as const,
              overflow: !isExpanded && showReadMore ? 'hidden' : 'visible',
              whiteSpace: !isExpanded && showReadMore ? 'normal' : 'pre-line'
            }}
          >
            {myAnswer.answerContent}
          </p>
          
          {showReadMore && (
            <button
              onClick={toggleExpanded}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-2 transition-colors inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              {isExpanded ? "Read less" : "Read more"}
              <span className="text-xs">
                {isExpanded ? "▲" : "▼"}
              </span>
            </button>
          )}
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={(open) => {
          // Don't allow closing while deleting
          if (!deleteAnswerMutation.isPending) {
            setIsDeleteModalOpen(open);
          }
        }}
        onConfirm={handleDelete}
        title="Delete Answer"
        description="Are you sure you want to delete this answer? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteAnswerMutation.isPending}
      />
      
      <WriteAnswreModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        questionId={myAnswer.questionId || ''}
        isEditMode={true}
        editAnswerId={myAnswer.answerId || ''}
        editAnswerContent={myAnswer.answerContent}
      />
    </>
  );
};

export default MyAnswerCard;
