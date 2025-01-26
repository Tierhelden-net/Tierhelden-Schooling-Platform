"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Quiz } from "@prisma/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface PointsFormProps {
  initialData: Quiz;
  quizId: number;
}

const formSchema = z.object({
  passing_points: z.coerce.number(),
});

export const PointsForm = ({ initialData, quizId }: PointsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [passingPoints, setPassingPoints] = useState(0);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passing_points: initialData?.passing_points || undefined,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      await axios.patch(
        `/api/quizzes/${quizId}/actions/computePassingPoints`,
        values
      );
      toast.success("Quiz updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <div className="font-medium flex items-center justify-between">
        Quiz Punkte
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Punkte bearbeiten
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.passing_points && "text-slate-500 italic"
          )}
        >
          {initialData.passing_points
            ? `zum Bestehen erforderliche Punkte: ${initialData.passing_points} / ${initialData.max_points}`
            : `Quiz wird bestanden. (Punkte zum Bestehen: 0 /  ${initialData.max_points} )`}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="passing_points"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    Wieviele Punkte braucht es zum Bestehen?
                  </FormDescription>
                  <FormControl>
                    <Input
                      className="accent-orange-400"
                      type="range"
                      step="0.5"
                      min="0"
                      max={initialData.max_points ?? 0}
                      value={field.value ?? 0} // Der Wert aus field, Fallback auf 0 falls undefined
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        field.onChange(e); // Wert an die Form-Bibliothek übergeben
                        setPassingPoints(value); // Aktualisiere auch den lokalen Zustand
                        console.log(passingPoints);
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="passing_points"
                    className={cn("ml-2 text-slate-400")}
                  >{`${
                    passingPoints + " / " + initialData.max_points
                  }`}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting} type="submit">
                Speichern
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
