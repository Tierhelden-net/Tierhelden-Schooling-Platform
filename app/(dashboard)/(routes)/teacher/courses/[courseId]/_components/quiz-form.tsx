"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course, CourseQuiz } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";

interface QuizFormProps {
  initialData: Course & { quizzes: CourseQuiz[] };
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  quizId: z.string().min(1),
});

export const QuizForm = ({ initialData, courseId, options }: QuizFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  //for loading animation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  //find a quizId, that is assigned to the course
  const [relationItem, setRelationItem] = useState<CourseQuiz>(
    initialData.quizzes[0]
  );
  const [selectedQuizId, setSelectedQuizId] = useState(
    relationItem?.quiz_id.toString() || ""
  );

  useEffect(() => {
    setRelationItem(
      //nicht: initialData.quizzes.find((el) => el.course_id === courseId) ||
      //gibt nur passende Elemente aus
      initialData.quizzes[0]
    );
    setSelectedQuizId(relationItem?.quiz_id.toString() || "");
  });

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quizId: selectedQuizId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedQuizId) {
      try {
        await axios.patch(
          `/api/courses/${courseId}/quiz/${relationItem.id}`,
          values
        );
        toast.success("Added Quiz updated");
        toggleEdit();
        router.refresh();
      } catch {
        toast.error("Something went wrong");
      }
    } else {
      try {
        await axios.post(`/api/courses/${courseId}/quiz`, values);
        toggleEdit();
        toast.success("Quiz added");
        router.refresh();
      } catch {
        toast.error("Something went wrong");
      }
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/quiz/${relationItem.id}`);
      toast.success("Quiz deleted");
      router.refresh();
      setSelectedQuizId("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const selectedOption = options.find(
    (option) => option.value === selectedQuizId
  );

  return (
    <div className="form-container">
      <div className="font-medium flex items-center justify-between">
        Quiz
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              bearbeiten
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div>
          <p
            className={cn(
              "text-sm mt-2",
              !selectedQuizId && "text-slate-500 italic"
            )}
          >
            {selectedOption?.label || "No quiz"}
          </p>
          {deletingId === selectedQuizId && (
            <div>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          {selectedQuizId && deletingId !== selectedQuizId && (
            <button
              onClick={() => onDelete(selectedQuizId)}
              className="ml-auto hover:opacity-75 transition"
            >
              <Trash className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="quizId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={...options} {...field} />
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
