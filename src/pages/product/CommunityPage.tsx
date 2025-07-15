import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Plus, ListFilter, PlusCircle, ArrowLeftIcon } from "lucide-react";
import { Question, MyAnswer } from "@/types/community";
import QuestionCard, { QuestionCardSkeleton } from "@/components/product/QuestionCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MyAnswerCard, { MyAnswerCardSkeleton } from '@/components/product/MyAnswerCard';
import AskQuestionModal from "@/components/product/AskQuestionModal";
import WriteAnswreModal from "@/components/product/WriteAnswreModal";
import Pagination from "@/components/ui/pagination";
import { useQuestions, useAnswers, useUserAnswers } from "@/hooks/useCommunity";
import { useParams } from "react-router-dom";
import { formatDate } from "@/utils/formatDate";
import { getUserDisplayName } from "@/utils/userHelpers";
import useUserStore from "@/store/useUserStore";
import LottieLoader from "@/components/LottieLoader";
import SecondaryLoader from "@/components/ui/SecondaryLoader";
import toast from "react-hot-toast";
import useUIStore from "@/store/useUIStore";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const CommunityPage = () => {
  const navigate = useNavigate();
  const { productSlug } = useParams();
  const { user ,isLoggedIn} = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'createdAt' | 'totalAnswers'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('community-qa');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [myAnswersPage, setMyAnswersPage] = useState(1);
  const { openAuthModal } = useUIStore();
  const queryClient = useQueryClient();
  // Fetch questions from API
  const { data: questionsData, isLoading: questionsLoading,isFetching: questionsFetching } = useQuestions({
    page: currentPage,
    limit: itemsPerPage,
    sortBy,
    sortOrder,
    status: 'approved'
  }, productSlug);

  // Fetch user's answers
  const { data: userAnswersData, isLoading: userAnswersLoading,isFetching: userAnswersFetching } = useUserAnswers(user?.id || '', productSlug);

  // Transform API data to match the existing UI structure
  const questions: Question[] = useMemo(() => {
    if (!questionsData?.questions) return [];

    return questionsData.questions.map((q: any) => ({
      id: q._id,
      question: q.title,
      date: formatDate(q.createdAt),
      isOwnQuestion: user?.id === q.author._id,
      totalAnswers: q.totalAnswers,
      answers: [] // Answers will be loaded separately when expanded
    }));
  }, [questionsData, user]);

  // Transform user's answers for the "My Answers" tab
  const myAnswers: MyAnswer[] = useMemo(() => {
    if (!userAnswersData) return [];

    return userAnswersData.map((answer: any) => ({
      id: answer.id,
      question: answer.question,
      questionDate: formatDate(answer.questionDate),
      answerContent: answer.answerContent,
      answerId: answer.answerId,
      questionId: answer.questionId,
      isOwnAnswer: answer.isOwnAnswer
    }));
  }, [userAnswersData]);

  // Client-side pagination for My Answers (since API doesn't support pagination yet)
  const paginatedMyAnswers = useMemo(() => {
    const startIndex = (myAnswersPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return myAnswers.slice(startIndex, endIndex);
  }, [myAnswers, myAnswersPage, itemsPerPage]);

  const myAnswersTotalPages = Math.ceil(myAnswers.length / itemsPerPage);

  const handleSortChange = (value: string) => {
    // Reset to first page when changing sort
    setCurrentPage(1);
    
    if (value === 'mostRecent') {
      setSortBy('createdAt');
      setSortOrder('desc');
    } else if (value === 'newest') {
      setSortBy('createdAt');
      setSortOrder('asc');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Reset pagination when changing tabs
    if (value === 'community-qa') {
      setCurrentPage(1);
      // Invalidate questions queries when switching to Community Q&A tab
      queryClient.invalidateQueries({ 
        queryKey: ['community-questions'],
        refetchType: 'active'
      });
    } else if (value === 'my-answers') {
      setMyAnswersPage(1);
      // Invalidate user answers queries when switching to My Answers tab
      queryClient.invalidateQueries({ 
        queryKey: ['user-answers'],
        refetchType: 'active'
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMyAnswersPageChange = (page: number) => {
    setMyAnswersPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen">
      <main className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4 justify-between w-full">
          <div className="flex items-center gap-2">
          <span className="block lg:hidden" onClick={() => navigate(-1)}>
            {" "}
            <ArrowLeftIcon className="w-6 h-6" />
          </span>
            <h1 className="text-2xl sm:text-3xl font-bold">Community</h1>
          </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-100 border-gray-200 rounded-full text-xs sm:text-sm h-10 sm:h-12"
                >
                  <ListFilter className="w-4 h-4 mr-2" />
                  Most Recent <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSortChange('mostRecent')}>
                  Most Recent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('newest')}>
                  Newest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex  items-start sm:items-center gap-4 justify-between w-full">
            <TabsList className="bg-gray-200 rounded-xl inline-flex cursor-pointer w-full sm:w-auto  h-10 sm:h-12">
              <TabsTrigger
                value="community-qa"
                className="px-3 sm:px-6 py-2 text-[10px] sm:text-sm font-semibold rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md flex-1 sm:flex-none cursor-pointer"
              >
                Community Q&A
              </TabsTrigger>
              <TabsTrigger
                value="my-answers"
                className="px-3 sm:px-6 py-2 text-[10px] sm:text-sm font-semibold rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md flex-1 sm:flex-none cursor-pointer"
              >
                My Answers
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button onClick={() => {
               if (!isLoggedIn) {
                openAuthModal();
                return;
              }
              
              setIsModalOpen(true)}
            } className="bg-blue-600 text-white hover:bg-blue-700 rounded-full w-full sm:w-auto text-xs sm:text-sm h-10 sm:h-12">
                <Plus className=" w-3 h-3 sm:mr-2 sm:w-4 sm:h-4 " />
                Ask Questions
              </Button>
            </div>
          </div>
          <TabsContent value="community-qa">
            <div className="space-y-6 mt-6">
              {questionsLoading || questionsFetching ? (
                // Show skeleton loaders while loading
                <>
                  {[1, 2, 3, 4].map((index) => (
                    <QuestionCardSkeleton key={index} />
                  ))}
                </>
              ) : questions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center min-h-[50vh]">
                  <img src="/svg/no_data.svg" alt="no-questions" className="w-1/4 mb-4" />
                  <p>No questions have been asked yet!</p>
                </div>
              ) : (
                questions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))
              )}
            </div>
            
            {/* Pagination for Questions */}
            {!questionsLoading && !questionsFetching && questions.length > 0 && questionsData?.pagination && (
              <Pagination
                currentPage={currentPage}
                totalPages={questionsData.pagination.pages || 1}
                onPageChange={handlePageChange}
                totalItems={questionsData.pagination.total || 0}
                itemsPerPage={itemsPerPage}
                showInfo={true}
                className="mt-8"
              />
            )}
          </TabsContent>
          <TabsContent value="my-answers">
            <div className="space-y-6 mt-6">
              {userAnswersLoading || userAnswersFetching ? (
                // Show skeleton loaders while loading
                <>
                  {[1, 2, 3, 4].map((index) => (
                    <MyAnswerCardSkeleton key={index} />
                  ))}
                </>
              ) : myAnswers.length === 0 ? (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center min-h-[50vh]">
                  <img src="/svg/no_data.svg" alt="no-answers" className="w-1/4 mb-4" />
                  <p>You haven't answered any questions yet!</p>
                </div>
              ) : (
                paginatedMyAnswers.map((answer) => (
                  <MyAnswerCard key={answer.id} myAnswer={answer} />
                ))
              )}
            </div>
            
            {/* Pagination for My Answers */}
            {!userAnswersLoading && !userAnswersFetching && myAnswers.length > 0 && myAnswersTotalPages > 1 && (
              <Pagination
                currentPage={myAnswersPage}
                totalPages={myAnswersTotalPages}
                onPageChange={handleMyAnswersPageChange}
                totalItems={myAnswers.length}
                itemsPerPage={itemsPerPage}
                showInfo={true}
                className="mt-8"
              />
            )}
          </TabsContent>
        </Tabs>
        <AskQuestionModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} productSlug={productSlug} />
      </main>
    </div>
  );
};

export default CommunityPage;
