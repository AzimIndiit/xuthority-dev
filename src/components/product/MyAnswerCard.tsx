import React, { useState } from 'react';
import { MyAnswer } from '@/types/community';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import ConfirmationModal from '../ui/ConfirmationModal';

interface MyAnswerCardProps {
  myAnswer: MyAnswer;
}

const MyAnswerCard: React.FC<MyAnswerCardProps> = ({ myAnswer }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    // Handle the delete logic here
    console.log(`Deleting answer ${myAnswer.id}`);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col justify-between sm:items-start ">
          <div className="flex justify-between w-full">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Q. {myAnswer.question}</h3>
              <div className="flex items-center gap-2 justify-between">
                <p className="text-sm text-gray-500 mt-1">{myAnswer.questionDate}</p>
                <div className=" gap-2 self-end sm:self-start flex-shrink-0 flex sm:hidden">
                  <Button className="bg-blue-600 text-white rounded-full hover:bg-blue-700 px-4 py-2 !text-xs flex items-center h-10 ">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-full px-4 py-2 !text-xs  text-white flex items-center h-10 "
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div className=" gap-2 self-end sm:self-start flex-shrink-0 hidden sm:flex">
              <Button className="bg-blue-600 text-white rounded-full hover:bg-blue-700 px-4 py-2 !text-xs flex items-center h-10 sm:h-12">
                <Edit className="w-3 h-3 sm:mr-1 sm:w-4 sm:h-4" />
                <span className="hidden sm:block"> Edit Answer</span>
              </Button>
              <Button
                variant="destructive"
                className="rounded-full px-4 py-2 !text-xs  text-white flex items-center h-10 sm:h-12"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="w-3 h-3 sm:mr-1 sm:w-4 sm:h-4" />
                <span className="hidden sm:block"> Delete Answer</span>
              </Button>
            </div>
          </div>
          <p className="text-gray-700 mt-4 text-sm line-clamp-2">{myAnswer.answerContent}</p>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        description="Do you really want to delete this answer? This action cannot be undone."
        confirmText="Delete"
      />
    </>
  );
};

export default MyAnswerCard;
