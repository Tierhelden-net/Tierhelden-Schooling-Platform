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
import { Form, useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Answer, Question, Quiz } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

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
  /*
  const [currentQuestion, setCurrentQuestion] = React.useState(
    quiz.questions[0]
  );*/
  const currentQuestion = quiz.questions[0];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: [],
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-center gap-4 mb-4">
        <div className="w-6/12 h-4 bg-slate-500/50 rounded-2xl ">
          <div
            className="w-6/12 h-4 bg-orange-400 bg-opacity-70 rounded-2xl "
            style={{
              width: `${
                //currentQuestionIndex / quiz.questions.length * 100
                30
              }%`,
            }}
          ></div>
        </div>
        <p className="text-xs">{"3 / 10"}</p>
      </div>
      <DataCard label={currentQuestion.question_title ?? "Question"}>
        {
          //<Form {...form}>
        }
        <form
          //onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mt-4"
        >
          <div className="form-container">
            <div className="bg-slate-500/20 bg-opacity-30 rounded-2xl p-4">
              <Preview value={currentQuestion.question_text!} />
              <Separator className="bg-background" />
              {/*  {currentQuestion.answers.map((answer) => (
                <FormField
                    control={form.control}
                    name="answers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
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
           */}

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
            </div>
            <Button className="m-4">next</Button>
          </div>
        </form>
        {
          // </Form>
        }
      </DataCard>
    </div>
  );
};

export default QuestionComponent;
