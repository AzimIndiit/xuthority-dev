import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Answer } from '@/types/community';
import { useNavigate } from 'react-router-dom';

interface AnswerCardProps {
  answer: Answer;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ answer }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showReadMore, setShowReadMore] = React.useState(false);
  const contentRef = React.useRef<HTMLParagraphElement>(null);

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
  }, [answer.content]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

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
      <p 
        ref={contentRef}
        className="text-gray-700 mt-2 text-sm  whitespace-pre-line"
        style={{
          display: !isExpanded && showReadMore ? '-webkit-box' : 'block',
          WebkitLineClamp: !isExpanded && showReadMore ? 4 : 'none',
          WebkitBoxOrient: 'vertical' as const,
          overflow: !isExpanded && showReadMore ? 'hidden' : 'visible',
          whiteSpace: !isExpanded && showReadMore ? 'normal' : 'pre-line'
        }}
      >
        {answer.content}
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
  );
};

export default AnswerCard; 