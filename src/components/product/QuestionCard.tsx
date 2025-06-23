import React, { useState } from 'react';
import { Question } from '@/types/community';
import AnswerCard from './AnswerCard';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import WriteAnswreModal from './WriteAnswreModal';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        {question.isOwnQuestion ? (
          <Button variant="destructive" className="rounded-full self-end sm:self-auto px-4 py-2 text-sm font-semibold h-10 sm:h-12">
            <Trash2 className="w-3 h-3 sm:mr-2 sm:w-4 sm:h-4" />
          <span className='hidden sm:block'> Delete Question</span>
          </Button>
        ) : (
          <Button onClick={() => setIsModalOpen(true)} variant="link" className="text-blue-600 font-semibold whitespace-nowrap p-0  self-start sm:self-auto text-sm sm:text-base">Write Your Answers</Button>
        )}
      </div>
      <div className="space-y-4 divide-y divide-gray-200">
        {question.answers.slice(0, 3).map((answer, index) => (
          <div key={answer.id} className={index > 0 ? '' : ''}>
            <AnswerCard answer={answer} />
          </div>
        ))}
        
      </div>
      {question.answers.length > 2 && (
        <div className="text-center mt-6">
          <Button variant="outline" className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600">
            View All Answers
          </Button>
        </div>
      )}
        <WriteAnswreModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />

    </div>
  );
};

export default QuestionCard; 