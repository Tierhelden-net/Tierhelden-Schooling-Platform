//TODO: pagination of the questions, how many are answered, how many are left? -> index?
//TODO: randomize questions? put them in a new order?
// speichere UserAnswers + QuizAttempts
// ? wie in die DB?

// ? Frieder fragen oder recherchieren: wie funktioniert react-hook-form??

// ? pic/video
// ? prev button
// ?progressbar oder kleine Fahne "2/3 Fragen" ...

"use client";
import { DataCard } from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";
import React from "react";
import * as z from "zod";

import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controller, Form, useForm, FormProvider } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Answer, Question, Quiz } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

interface QuestionComponentProps {
  quiz: Quiz & {
    questions: (Question & {
      answers: Answer[];
    })[];
  };
}

const formSchema = z.object({
  answers: z.string().array().nonempty(),
});

export const QuestionComponent = ({ quiz }: QuestionComponentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const currentQuestion = quiz.questions[currentQuestionIndex];

  const lastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleNext = () => {
    if (!lastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Checked answers:", data.answers);
  };

  return (
    <div className="p-6">
      <div className="flex justify-center gap-4 mb-4">
        <div className="w-6/12 h-4 bg-slate-500/50 rounded-2xl ">
          <div
            className="w-6/12 h-4 bg-orange-400 bg-opacity-70 rounded-2xl "
            style={{
              width: `${
                ((currentQuestionIndex + 1) / quiz.questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
        <p className="text-xs">
          {currentQuestionIndex + 1 + " / " + quiz.questions.length}
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
                {currentQuestion.answers.map((answer) => (
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

                {/*}
                {currentQuestion.answers.map((answer) => (
                  <label
                    className="flex items-center cursor-pointer gap-2 m-2"
                    key={answer.answer_id}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer accent-orange-400"
                      name={currentQuestion.question_id.toString()}
                      id={answer.answer_id.toString()}
                      value={answer.answer_id.toString()}
                    />
                    <p>{answer.answer_text}</p>
                  </label>
                ))}
                  */}
              </div>
              <Button
                className="m-4"
                disabled={form.getValues("answers").length === 0}
                onClick={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
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
