// ? pic/video
// ? prev button

"use client";
import { DataCard } from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";
import React, { use, useEffect } from "react";
import * as z from "zod";

import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { Controller, useForm, FormProvider } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import {
  Answer,
  Question,
  Quiz,
  QuizAttempt,
  UserAnswer,
} from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface QuestionComponentProps {
  quiz: Quiz;
  questions: (Question & {
    answers: Answer[];
  })[];
  quizAttemptId: string;
  courseId: string;
  quizAttempt: QuizAttempt & { userAnswers: UserAnswer[] };
}

const formSchema = z.object({
  question_id: z.string(),
  answers: z.string().array().nonempty(),
});

export const QuestionComponent = ({
  quiz,
  questions,
  quizAttemptId,
  courseId,
  quizAttempt,
}: QuestionComponentProps) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  if (!quizAttempt) {
    router.push(`/courses/${courseId}/quiz/${quiz.quiz_id}`);
  }

  //filter out the questions that have been answered
  const [answeredQuestions, setAnsweredQuestions] = React.useState<string[]>(
    quizAttempt.userAnswers?.map((ua) => ua.question_id ?? null)
  );
  if (answeredQuestions.includes(currentQuestion.question_id)) {
    setCurrentQuestionIndex((prev) => prev + 1);
  } else if (currentQuestionIndex >= questions.length) {
    router.push(`/courses/${courseId}/quiz/${quiz.quiz_id}/result`);
  }

  //shuffle answers
  const [answers, setAnswers] = React.useState<Answer[]>(
    currentQuestion.answers
  );
  useEffect(() => {
    if (currentQuestion.random_answers) {
      setAnswers(currentQuestion.answers.sort(() => Math.random() - 0.5));
    } else {
      setAnswers(currentQuestion.answers);
    }
  }, [currentQuestionIndex]);

  const lastQuestion = currentQuestionIndex === questions.length - 1;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: [],
      question_id: currentQuestion.question_id,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await axios.post(
        `/api/quizzes/${quiz.quiz_id}/quizAttempt/${quizAttemptId}/userAnswer`,
        data
      );

      if (!lastQuestion) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error while submitting your answers");
    } finally {
      setIsLoading(false);
    }
    //calculate the result and push it into the db:
    if (lastQuestion) {
      try {
        await axios.patch(
          `/api/quizzes/${quiz.quiz_id}/quizAttempt/${quizAttemptId}`
        );
        router.push(`/courses/${courseId}/quiz/${quiz.quiz_id}/result`);
      } catch (e) {
        console.error(e);
        toast.error("Error while submitting your quiz results");
      } finally {
        setIsLoading(false);
      }
    }
  };

  //after the question is answered, reset the form
  React.useEffect(() => {
    form.reset({
      question_id: currentQuestion.question_id,
      answers: [],
    });
  }, [currentQuestionIndex]);

  return (
    <div className="p-6">
      <div className="flex justify-center gap-4 mb-4">
        <div className="w-6/12 h-4 bg-slate-500/50 rounded-2xl ">
          <div
            className="w-6/12 h-4 bg-orange-400 bg-opacity-70 rounded-2xl "
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
        <p className="text-xs">
          {currentQuestionIndex + 1 + " / " + questions.length}
        </p>
      </div>
      <DataCard label={currentQuestion.question_title ?? "Question"}>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="form-container">
              <div className="bg-slate-500/20 bg-opacity-30 rounded-2xl p-4">
                <Preview value={currentQuestion.question_text!} />
                <Separator className="bg-background" />
                {answers.map((answer) => (
                  <FormField
                    key={answer.answer_id}
                    control={form.control}
                    name="answers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Controller
                            name="answers"
                            control={form.control}
                            render={({ field }) => (
                              <input
                                type="checkbox"
                                className="h-4 w-4 cursor-pointer accent-orange-400"
                                value={answer.answer_id.toString()}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const isChecked = e.target.checked;

                                  if (isChecked) {
                                    field.onChange([...field.value, value]);
                                  } else {
                                    field.onChange(
                                      field.value.filter((v) => v !== value)
                                    );
                                  }
                                }}
                              />
                            )}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormDescription>
                            {answer.answer_text}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <Button
                className="m-4"
                disabled={form.getValues("answers").length === 0 || isLoading}
                type="submit"
              >
                {lastQuestion ? "Finish" : "Next"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DataCard>
    </div>
  );
};

export default QuestionComponent;
