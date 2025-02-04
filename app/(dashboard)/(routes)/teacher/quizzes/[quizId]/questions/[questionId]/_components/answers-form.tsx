"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Answer, Question } from "@prisma/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";
import { AnswersList } from "./answers-list";
import { Textarea } from "@/components/ui/textarea";

interface AnswerFormProps {
  initialData: Question & { answers: Answer[] };
  quizId: string;
  questionId: string;
}

const formSchema = z.object({
  answer_text: z.string().min(1),
  is_correct: z.boolean(),
  //answer_pic: z.string(),
});

export const AnswerForm = ({
  initialData,
  quizId,
  questionId,
}: AnswerFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer_text: "",
      is_correct: false,
      //answer_pic: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onEdit = (id: string) => {
    toggleCreating();
  };

  //TODO: sort the answers in the database before rendering
  initialData.answers.sort((a, b) => a.position - b.position);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUpdating(true);
      await axios.post(
        `/api/quizzes/${quizId}/questions/${questionId}/answers/create`,
        values
      );
      toast.success("Answer created");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onReorder = async (updateData: { id: number; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(
        `/api/quizzes/${quizId}/questions/${questionId}/answers/reorder`,
        {
          list: updateData,
        }
      );
      toast.success("Answers reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative form-container">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-orange-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Answers
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Antwort erstellen
            </>
          )}
        </Button>
      </div>
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.answers.length && "text-slate-500 italic"
          )}
        >
          {!initialData.answers.length && "No Answers"}
          <AnswersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.answers || []}
          />
        </div>
      )}
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="answer_text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. 'the answer is...'"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_correct"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>answer is correct?</FormDescription>
                  </div>
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
