"use client";
import Quiz from "react-quiz-component";
import { Answer, Question } from "@prisma/client";
import { Quiz as QuizSchema } from "@prisma/client";

interface QuizComponentProps {
  quiz: QuizSchema & {
    questions: (Question & {
      answers: Answer[];
    })[];
  };
}

export const QuizComponent = ({ quiz }: QuizComponentProps) => {
  return (
    <div>
      <Quiz quiz={quiz} shuffle={true} />
    </div>
  );
};
