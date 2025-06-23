import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Plus, ListFilter, PlusCircle } from "lucide-react";
import { Question, MyAnswer } from "@/types/community";
import QuestionCard from "@/components/product/QuestionCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MyAnswerCard from '@/components/product/MyAnswerCard';
import AskQuestionModal from "@/components/product/AskQuestionModal";
import WriteAnswreModal from "@/components/product/WriteAnswreModal";

const CommunityPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const questions: Question[] = [
    {
      id: "1",
      question: "Is Monday.com suitable for small businesses?",
      date: "Jan 27, 2025",
      isOwnQuestion: false,
      answers: [
        {
          id: "1-1",
          author: {
            name: "monday",
            avatarUrl: "https://i.pravatar.cc/40?u=monday",
            isVendor: true,
          },
          date: "Jan 27, 2025",
          content:
            "Absolutely! Monday.com is designed to be flexible and scalable, making it a great fit for small businesses. It offers customizable workflows, automation, and integrations that help teams stay organized and efficient. Plus, our affordable pricing plans ensure small businesses get value without overspending.",
        },
        {
          id: "1-2",
          author: {
            name: "Admin",
            avatarUrl: "https://i.pravatar.cc/40?u=admin",
            isVendor: false,
          },
          date: "Jan 27, 2025",
          content:
            "Yes, Monday.com works well for small businesses, but setup and customization are crucial. As an admin, I find that configuring the right boards and automations takes time, but once set up, it streamlines operations. However, pricing may be a consideration for businesses with tight budgets.",
        },
        {
          id: "1-3",
          author: {
            name: "Calista Mayasari",
            avatarUrl: "https://i.pravatar.cc/40?u=calista",
            isVendor: false,
          },
          date: "Jan 28, 2025",
          content:
            "Monday.com is useful, but it depends on your needs. For simple task tracking, it works well, but the interface can feel overwhelming at first. If you're a small team that needs basic project management, it's great—just be prepared for a learning curve.",
        },
      ],
    },
    {
      id: "2",
      question:
        "Can I integrate Monday.com with other tools like Slack and Google Drive?",
      date: "Jan 27, 2025",
      isOwnQuestion: false,
      answers: [
        {
          id: "2-1",
          author: {
            name: "monday",
            avatarUrl: "https://i.pravatar.cc/40?u=monday",
            isVendor: true,
          },
          date: "Jan 27, 2025",
          content:
            "Yes, Monday.com integrates with popular tools such as Slack, Google Drive, Microsoft Teams, and more to streamline workflows.",
        },
      ],
    },
    {
      id: "3",
      question: "Does Monday.com offer automation for repetitive tasks?",
      date: "Jan 26, 2025",
      isOwnQuestion: true,
      answers: [
        {
          id: "3-1",
          author: {
            name: "monday",
            avatarUrl: "https://i.pravatar.cc/40?u=monday",
            isVendor: true,
          },
          date: "Jan 27, 2025",
          content:
            "Yes, Monday.com provides automation to reduce manual work, such as task assignments, status updates, and notifications.",
        },
        {
          id: "3-2",
          author: {
            name: "Zahra Mohamed",
            avatarUrl: "https://i.pravatar.cc/40?u=zahra",
            isVendor: false,
          },
          date: "Jan 27, 2025",
          content:
            "Yes, Monday.com automates many routine tasks like sending reminders and updating task statuses. I find it useful, but sometimes the automation rules need fine-tuning to work exactly as expected.",
        },
        {
          id: "3-3",
          author: {
            name: "Jesús Romero",
            avatarUrl: "https://i.pravatar.cc/40?u=jesus",
            isVendor: false,
          },
          date: "Jan 28, 2025",
          content:
            "Definitely! I've used Monday.com to automate repetitive steps like task handovers and deadline tracking. It's a great way to boost efficiency, but if you rely on advanced automation, you might need a premium plan.",
        },
      ],
    },
  ];

  const myAnswers: MyAnswer[] = [
    {
      id: 'ans1',
      question: 'What are the limitations of Monday.com?',
      questionDate: 'Jan 27, 2025',
      answerContent: 'Some users find the pricing higher compared to alternatives, and the platform can feel overwhelming with too many customization options.',
    },
    {
      id: 'ans2',
      question: 'Can I use Monday.com for personal task management?',
      questionDate: 'Jan 27, 2025',
      answerContent: 'Yes, Monday.com can be used for personal productivity, but it is primarily designed for team collaboration.',
    },
    {
      id: 'ans3',
      question: 'Is Monday.com suitable for small businesses?',
      questionDate: 'Jan 27, 2025',
      answerContent: 'Absolutely! Monday.com is designed to be flexible and scalable, making it a great fit for small businesses. It offers customizable workflows, automation, and integrations that help teams stay organized and efficient.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <main className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4 justify-between w-full">
            <h1 className="text-2xl sm:text-3xl font-bold">Community</h1>
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
                <DropdownMenuItem>Most Recent</DropdownMenuItem>
                <DropdownMenuItem>Most Helpful</DropdownMenuItem>
                <DropdownMenuItem>Newest</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="community-qa">
          <div className="flex  items-start sm:items-center gap-4 justify-between w-full">
            <TabsList className="bg-gray-200 rounded-xl inline-flex cursor-pointer w-full sm:w-auto  h-10 sm:h-12">
              <TabsTrigger
                value="community-qa"
                className="px-3 sm:px-6 py-2 text-[10px] sm:text-sm font-semibold rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md flex-1 sm:flex-none"
              >
                Community Q&A
              </TabsTrigger>
              <TabsTrigger
                value="my-answers"
                className="px-3 sm:px-6 py-2 text-[10px] sm:text-sm font-semibold rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md flex-1 sm:flex-none"
              >
                My Answers
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full w-full sm:w-auto text-xs sm:text-sm h-10 sm:h-12">
                <Plus className=" w-3 h-3 sm:mr-2 sm:w-4 sm:h-4 " />
                Ask Questions
              </Button>
            </div>
          </div>
          <TabsContent value="community-qa">
            <div className="space-y-6 mt-6">
              {questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="my-answers">
            <div className="space-y-6">
              {myAnswers.map((answer) => (
                <MyAnswerCard key={answer.id} myAnswer={answer} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        <AskQuestionModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      </main>
    </div>
  );
};

export default CommunityPage;
