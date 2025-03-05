"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Switch, SwitchThumb } from "@radix-ui/react-switch";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface RandomQFormProps {
  initialData: {
    random_questions: boolean;
  };
  quizId: string;
}

const formSchema = z.object({
  random_questions: z.boolean(),
});

export const RandomQForm = ({ initialData, quizId }: RandomQFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [randomQuestions, setRandomQuestions] = useState(
    initialData.random_questions
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      random_questions: initialData?.random_questions || false,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
        Fragen randomizieren?
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Abbrechen</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              bearbeiten
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2">
          ask Questions in random order:
          {initialData.random_questions ? (
            <Check className="inline" />
          ) : (
            <X className="inline" />
          )}
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
              name="random_questions"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FormLabel
                      htmlFor="random_questions"
                      {...field}
                      className="flex items-center"
                    >
                      randomize:
                      <Switch
                        className="relative mx-3 h-[25px] w-[42px] cursor-default rounded-full bg-foreground shadow-[0_2px_10px] shadow-foreground outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground data-[state=checked]:bg-foreground"
                        id="random_questions"
                        disabled={isSubmitting}
                        checked={randomQuestions}
                        onCheckedChange={setRandomQuestions}
                      >
                        <SwitchThumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-orange-300 shadow-[0_2px_2px] shadow-black transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
                      </Switch>
                      <FormMessage className="text-gray-400">
                        {randomQuestions ? "on" : "off"}
                      </FormMessage>
                    </FormLabel>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Speichern
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
