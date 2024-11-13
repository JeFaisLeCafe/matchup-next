export type Answer = {
  id: string;
  imageUrl: string;
};

export type Question = {
  id: string;
  text: string;
  answers: Answer[];
};

export type Quiz = {
  id: string;
  title: string;
  questions: Question[];
};
