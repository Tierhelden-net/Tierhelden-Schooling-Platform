"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionAnswerMessageFormProps {
  initialData: {
    message_for_correct_answer: string;
    message_for_incorrect_answer: string;
  };
  quizId: string;
  questionId: string;
}

const formSchema = z.object({
  message_for_correct_answer: z.string(),
  message_for_incorrect_answer: z.string(),
});

export const QuestionAnswerMessageForm = ({
  initialData,
  quizId,
  questionId,
}: QuestionAnswerMessageFormProps) => {
  const [isEditing1, setIsEditing1] = useState(false);
  const [isEditing2, setIsEditing2] = useState(false);

  const toggleEdit1 = () => setIsEditing1((current) => !current);
  const toggleEdit2 = () => setIsEditing2((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit1 = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/quizzes/${quizId}/questions/${questionId}/actions`,
        values
      );
      toast.success("Question updated");
      toggleEdit1();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };
  const onSubmit2 = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/quizzes/${quizId}/questions/${questionId}/actions`,
        values
      );
      toast.success("Question updated");
      toggleEdit2();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <div className="font-medium flex items-center justify-between">
        Message for correct answer
        <Button onClick={toggleEdit1} variant="ghost">
          {isEditing1 ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit message
            </>
          )}
        </Button>
      </div>
      {!isEditing1 && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.message_for_correct_answer && "text-slate-500 italic"
          )}
        >
          {initialData.message_for_correct_answer
            ? initialData.message_for_correct_answer
            : "Kein Text."}
        </p>
      )}
      {isEditing1 && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit1)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="message_for_correct_answer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Well done...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}

      <div className="font-medium flex items-center justify-between">
        Message for incorrect answer
        <Button onClick={toggleEdit2} variant="ghost">
          {isEditing2 ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit message
            </>
          )}
        </Button>
      </div>
      {!isEditing2 && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.message_for_incorrect_answer && "text-slate-500 italic"
          )}
        >
          {initialData.message_for_incorrect_answer
            ? initialData.message_for_incorrect_answer
            : "Kein Text."}
        </p>
      )}
      {isEditing2 && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit2)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="message_for_incorrect_answer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Not correct, try again...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
