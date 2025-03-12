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

//form Schema for creating a new answer
const createFormSchema = z.object({
  answer_text: z.string().min(1),
  is_correct: z.boolean(),
});
//form Schema for editing/updating an existing answer
const editFormSchema = z.object({
  answer_text: z.string().min(1),
  is_correct: z.boolean(),
  //answer_pic: z.string(),
  //answer_video: z.string(),
  answer_id: z.number(),
});

export const AnswerForm = ({
  initialData,
  quizId,
  questionId,
}: AnswerFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  //form for creating a new answer
  const createForm = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      answer_text: "",
      is_correct: false,
    },
  });

  //form for editing/updating an existing answer
  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      answer_text: "",
      is_correct: false,
      //answer_pic: "",
      //answer_video: "",
      answer_id: 0,
    },
  });

  const { isSubmitting, isValid } = createForm.formState;

  const onEdit = (id: string) => {
    setIsEditing(true);
    const currentAnswer = initialData.answers.find(
      (a) => a.answer_id.toString() === id
    );
    editForm.setValue("answer_id", parseInt(id));
    editForm.setValue("answer_text", currentAnswer?.answer_text ?? "");
    editForm.setValue("is_correct", currentAnswer?.is_correct ?? false);
    toggleCreating();
  };

  const onCreateSubmit = async (values: z.infer<typeof createFormSchema>) => {
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

  const onEditSubmit = async (values: z.infer<typeof createFormSchema>) => {
    try {
      setIsUpdating(true);
      await axios.patch(
        `/api/quizzes/${quizId}/questions/${questionId}/answers/`,
        values
      );
      toast.success("Answer updated");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
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

  const onDelete = async (answerId: string) => {
    try {
      setIsUpdating(true);

      await axios.delete(
        `/api/quizzes/${quizId}/questions/${questionId}/answers/${answerId}`
      );

      toast.success("Antwort gelöscht");
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
        <span className="text-xs text-inactive italic">required</span>
        <Button
          onClick={() => {
            toggleCreating();
            setIsEditing(false);
          }}
          variant="ghost"
        >
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
            onDelete={onDelete}
            items={initialData.answers || []}
          />
        </div>
      )}
      {isCreating && !isEditing && (
        <Form {...createForm}>
          <form
            onSubmit={createForm.handleSubmit(onCreateSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={createForm.control}
              name="answer_text"
              render={({ field }) => (
                <FormItem>
                  <FormMessage>Create an answer</FormMessage>
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
              control={createForm.control}
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
      {isCreating && isEditing && (
        <Form {...editForm}>
          <form
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={editForm.control}
              name="answer_text"
              render={({ field }) => (
                <FormItem>
                  <FormMessage>Edit the answer</FormMessage>
                  <FormControl>
                    <Textarea
                      disabled={editForm.formState.isSubmitting}
                      placeholder="e.g. 'the answer is...'"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
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
              <Button
                disabled={
                  !editForm.formState.isValid || editForm.formState.isSubmitting
                }
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
