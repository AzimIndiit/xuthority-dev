export interface Answer {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
    isVendor: boolean;
  };
  date: string;
  content: string;
}

export interface Question {
  id: string;
  question: string;
  date: string;
  isOwnQuestion?: boolean;
  answers: Answer[];
}

export interface MyAnswer {
  id: string;
  question: string;
  questionDate: string;
  answerContent: string;
} 