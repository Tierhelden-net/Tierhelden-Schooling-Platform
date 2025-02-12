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
  const quizItem = {
    quizTitle: quiz.quiz_name,
    quizSynopsis: quiz.quiz_synopsis,
    progressBarColor: "#9de1f6",
    nrOfQuestions: quiz.questions.length.toString(),
    questions: quiz.questions.map((question) => {
      return {
        question: question.question_title ?? "",
        questionType: "text",
        questionPic: question.question_pic ?? "",
        //"answerSelectionType": question.correct_answers? > 1 ? "multiple":"single",
        answerSelectionType:
          question.answers.filter((a) => a.is_correct).length > 1
            ? "multiple"
            : "single",
        //answerSelectionType: "multiple",
        answers: question.answers.map((answer) => answer.answer_text),
        correctAnswer: question.answers
          .filter((answer) => answer.is_correct)
          .map((answer) => answer.position),
        messageForCorrectAnswer:
          question.message_for_correct_answer ?? "richtig",
        messageForIncorrectAnswer:
          question.message_for_incorrect_answer ?? "falsch",
        explanation: question.explanation ?? "deshalb!",
        point: question.points?.toString() ?? "0",
      };
    }),
  };

  return (
    <div>
      <Quiz quiz={quizItem} shuffle={true} />
    </div>
  );
};
