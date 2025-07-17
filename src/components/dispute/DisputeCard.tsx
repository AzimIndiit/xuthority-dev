import React, { useState, useEffect } from 'react';
import { DisputedReview, Dispute } from '@/types/dispute';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, Loader2, Check, X } from 'lucide-react';
import StarRating from '../ui/StarRating';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import useUserStore from '@/store/useUserStore';
import { getUserDisplayName, getUserInitials } from '@/utils/userHelpers';
import { useNavigate } from 'react-router-dom';
import { useReviewStore } from '@/store/useReviewStore';
import { Product } from '@/services/product';
import { useDeleteReview } from '@/hooks/useReview';
import { useAddExplanation, useDeleteDispute, useUpdateExplanation } from '@/hooks/useDispute';
import ConfirmationModal from '../ui/ConfirmationModal';
import { formatDate } from '@/utils/formatDate';
import DisputeModal from '../product/DisputeModal';

interface DisputeCardProps {
  review: DisputedReview;
  dispute: Dispute;
  product: Product;
  refetchDisputes: () => void;
}

const statusStyles = {
  active: 'bg-green-100 text-green-800',
  resolved: 'bg-blue-100 text-blue-800',
};

const DisputeCard: React.FC<DisputeCardProps> = ({ review, dispute, product, refetchDisputes }) => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { setSelectedSoftware } = useReviewStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [explanation, setExplanation] = useState(dispute.explanations || '');
  const [editExplanation, setEditExplanation] = useState(dispute.explanations ? false : true);
  const [isDeleteDisputeModalOpen, setIsDeleteDisputeModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = React.useRef<HTMLParagraphElement>(null);
    const deleteReviewMutation = useDeleteReview();
  const addExplanationMutation = useAddExplanation();
  const updateExplanationMutation = useUpdateExplanation();
  const deleteDisputeMutation = useDeleteDispute();
  // Update explanation state when dispute changes
  useEffect(() => {
    setExplanation(dispute.explanations || '');
  }, [dispute.explanations]);

  // Check if dispute description needs truncation
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
  }, [dispute.description]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeleteReview = () => {
    deleteReviewMutation.mutate(review.id);
    setIsDeleteModalOpen(false);
  };

  const handleSubmitExplanation = () => {
    if (!explanation.trim()) return;
    
    addExplanationMutation.mutate({
      disputeId: dispute.id,
      data: { explanation: explanation.trim() }
    }, {
      onSuccess: () => {
        setExplanation('');
        refetchDisputes();
      }
    });
  };

  const handleUpdateExplanation = () => {
    if (!explanation.trim() || !dispute.explanationsId) return;
    
    updateExplanationMutation.mutate({
      disputeId: dispute.id,
      explanationId: dispute.explanationsId,
      data: { explanation: explanation.trim() }
    }, {
      onSuccess: () => {
        refetchDisputes();
        setEditExplanation(false);
      }
    });
  };

  const isAuthor = (authorId: string) => {
    return user?.id === authorId;
  };

  const handleDeleteDispute = () => {
    deleteDisputeMutation.mutate(dispute.id, {
      onSuccess: () => {
        setIsDeleteDisputeModalOpen(false);
        refetchDisputes();
      }
    });
  };

  console.log('dispute', dispute)
  return (
    <div className="bg-white p-4  rounded-lg border border-gray-200 shadow-sm">
      {/* Review Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => {  if(review.id !== user?.id){ navigate(`/public-profile/${review.slug}`)}else{
              navigate(`/profile`)
            }}}>
          <div className="relative w-10 h-10">
            <Avatar className="h-10 w-10" >
              <AvatarImage src={review.avatar} alt={getUserDisplayName(review as any)} />
              <AvatarFallback>{getUserInitials(review as any)}</AvatarFallback>
            </Avatar>
    
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-[13px] leading-tight">{getUserDisplayName(review as any)}</p>
            <p className="text-xs text-gray-600 leading-tight">
              {review.userTitle?.split(' ').slice(0, 2).join(' ') || ''}
              {review.companyName && (
                <>
                  , <span className="font-normal">{review.companyName}</span>
                </>
              )}
              {review.companySize && (
                <> ({review.companySize} emp.)</>
              )}
            </p>
          </div>
        </div>
      
      </div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">"{review.title}"</h2>
          <div className="flex items-center gap-4 mt-2">
            <StarRating rating={review.rating} />
            <span className="text-gray-600 text-xs sm:text-sm">
              {review.date}
            </span>
          </div>
          <p 
              ref={contentRef}
              className="text-gray-700 mt-4 text-xs sm:text-sm  whitespace-pre-line"
              style={{
                display: !isExpanded && showReadMore ? '-webkit-box' : 'block',
                WebkitLineClamp: !isExpanded && showReadMore ? 4 : 'none',
                WebkitBoxOrient: 'vertical' as const,
                overflow: !isExpanded && showReadMore ? 'hidden' : 'visible',
                whiteSpace: !isExpanded && showReadMore ? 'normal' : 'pre-line'
              }}
            >
              {review.content}
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
     { review.isOwnReview &&  dispute.status === 'active' &&  <div className="flex gap-2 self-end sm:self-start flex-shrink-0">
          <Button onClick={() => {
             setSelectedSoftware({
              id: product._id,
              name: product.name,
              logoUrl: product.logoUrl,
            
             });
            navigate(`/write-review`);
          }} className="bg-blue-600 text-white rounded-full hover:bg-blue-700 px-4 py-2 !text-xs font-semibold flex items-center h-10">
            <Edit className="w-2 h-2" />
          <span className="hidden sm:block text-xs"> Edit Review</span>
          </Button>
          {/* <Button 
            variant="destructive" 
            className="rounded-full px-4 py-2 !text-xs font-semibold flex items-center h-10"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteReviewMutation.isPending}
          >
            {deleteReviewMutation.isPending ? (
              <Loader2 className="w-2 h-2 animate-spin" />
            ) : (
              <Trash2 className="w-2 h-2" />
            )}
            <span className="hidden sm:block text-xs"> Delete Review</span>
          </Button> */}

         
        </div>}
      </div>

      {/* <hr className="my-8 border-gray-200" /> */}

      {/* Dispute Section */}
      <div className='mt-4'>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Dispute</h3>
        <div className="flex items-center gap-3 my-4  cursor-pointer"  onClick={() => {
              navigate(`/product-detail/${product.slug}`)
            }}>
          <div className="relative w-12 h-12" >
            <Avatar className="h-12 w-12 ">
              <AvatarImage src={product.logoUrl} alt={product.name} />
              <AvatarFallback>{product.name.split(' ').slice(0, 2).join(' ')}</AvatarFallback>
            </Avatar>
    
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-[16px] leading-tight capitalize">{product.name}</p>
            <p className="text-xs text-gray-600 leading-tight">
              {formatDate(product.createdAt)}
              
            </p>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center gap-2 justify-between w-full">
        <div className='flex items-center gap-2 '>
        <h4 className="text-base sm:text-lg font-semibold text-gray-900">{dispute.reason}</h4>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusStyles[dispute.status]}`}>
              {dispute.status}
            </span>
        </div>
            { dispute.isOwner && location.pathname === '/profile/dispute-management' &&   <div className="flex gap-2 self-end sm:self-start flex-shrink-0">
          <Button onClick={() => {
            console.log('Opening dispute modal with data:', dispute);
            setIsDisputeModalOpen(true);
          }}
           className="bg-blue-600 text-white rounded-full hover:bg-blue-700 px-4 py-2 !text-xs font-semibold flex items-center h-10">
            <Edit className="w-2 h-2" />
          <span className="hidden sm:block text-xs"> Edit Dispute</span>
          </Button>
          <Button 
            variant="destructive" 
            className="rounded-full px-4 py-2 !text-xs font-semibold flex items-center h-10"
            onClick={() => setIsDeleteDisputeModalOpen(true)}
            disabled={deleteDisputeMutation.isPending}
            loading={deleteDisputeMutation.isPending}
          >
            <Trash2 className="w-2 h-2" />
            <span className="hidden sm:block text-xs"> Delete Dispute</span>
          </Button> 
          </div>}
          </div>
          <div className="text-gray-700 mt-2 space-y-2 text-xs sm:text-sm">
            <p>{dispute.description}</p>
            
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      {dispute.explanations && dispute.status === 'active' && (
        <div className='mt-4'>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Explanation</h3>
          <div className="mt-2 flex justify-between items-start text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-20 gap-4">
            <p className="0">
              {dispute.explanations}
            </p>
           { review.isOwnReview &&  <button className='text-blue-600 text-sm cursor-pointer flex gap-2 items-center justify-center' onClick={() => {
              setEditExplanation(prev => !prev)
              setExplanation(dispute.explanations)
            }}><Edit className="w-3 h-3" /> Edit</button>}
          </div>
        </div>
      )}

      {/* Add/Edit Explanation Section */}
      {  editExplanation  && <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900">
          {dispute.explanations ? 'Edit' : 'Add'} Explanation
        </h3>
        <div className="mt-4 flex flex-col sm:flex-row items-start gap-4">
          <Textarea
            placeholder="Type here..."
            className="w-full sm:flex-1 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 h-12 min-h-[100px] max-h-40"
            value={explanation}
            rows={3}
            maxLength={1000}
            onChange={(e) => setExplanation(e.target.value)}
            disabled={addExplanationMutation.isPending || updateExplanationMutation.isPending}
          />
          <Button 
            className="bg-blue-600 text-white rounded-full hover:bg-blue-700 px-6 py-3 font-semibold self-end sm:self-auto"
            onClick={dispute.explanations ? handleUpdateExplanation : handleSubmitExplanation}
            disabled={addExplanationMutation.isPending || updateExplanationMutation.isPending || !explanation.trim()}
            loading={addExplanationMutation.isPending || updateExplanationMutation.isPending}
          >
            {dispute.explanations ? 'Update' : 'Submit'}
          </Button>
        </div>
      </div>}
      
      {/* Delete Review Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDeleteReview}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteReviewMutation.isPending}
      />
  {/* Delete Dispute Confirmation Modal */}
<ConfirmationModal
        isOpen={isDeleteDisputeModalOpen}
        onOpenChange={setIsDeleteDisputeModalOpen}
        onConfirm={handleDeleteDispute}
        title="Delete Dispute"
        description="Are you sure you want to delete this dispute? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteDisputeMutation.isPending}
        cancelText="Cancel"
      />


<DisputeModal
          isOpen={isDisputeModalOpen}
          onOpenChange={setIsDisputeModalOpen}
          reviewId={review.id}
          isEdit={true}
          dispute={dispute}
          onSuccess={refetchDisputes}
        />
    </div>
  );
};

export default DisputeCard; 