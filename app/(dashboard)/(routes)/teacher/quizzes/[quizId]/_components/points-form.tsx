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
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@radix-ui/react-slider";

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
      await axios.patch(`/api/quizzes/${quizId}/actions/`, values);
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
                    <Slider
                      className="relative flex h-5 w-auto touch-none select-none items-center"
                      step={0.5}
                      max={initialData.max_points ?? 0}
                      value={[field.value ?? 0]} // Der Wert aus field, Fallback auf 0 falls undefined
                      onValueChange={(v) => {
                        field.onChange(v); // Wert an die Form-Bibliothek übergeben
                        setPassingPoints(Number(v)); // Aktualisiere auch den lokalen Zustand
                      }}
                      disabled={isSubmitting}
                    >
                      <SliderTrack className="relative h-[5px] grow rounded-full bg-input">
                        <SliderRange className="absolute h-full rounded-full bg-orange-400" />
                      </SliderTrack>
                      <SliderThumb
                        className="block h-5 w-5 rounded-[10px] bg-accent-foreground shadow-[0_0_10px] shadow-accent-foreground
                         hover:bg-orange-400"
                        aria-label="passingPoints"
                      />
                    </Slider>
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
