"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

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
import { Combobox } from "@/components/ui/combobox";
import { DataCard } from "../../../analytics/_components/data-card";

interface UserroleFormProps {
  initialData: User;
  userId: string;
}

const formSchema = z.object({
  user_role: z.array(z.string()),
});

export const UserroleForm = ({ initialData, userId }: UserroleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const userRoles = [
    "BETREUER",
    "BERATER",
    "ADMIN",
    "EVENTLEITER",
    "AFFILIATE",
    "SUBADMIN",
  ];

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_role: initialData?.user_role || [],
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/users/${userId}`, values);
      toast.success("User role updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <DataCard label="Userrolle">
        <div className="flex justify-between ">
          <ul className="pl-4">
            {!isEditing &&
              initialData.user_role.map((role) => (
                <li className="mt-2">
                  <Badge
                    className={cn(
                      "bg-slate-500",
                      role === "ADMIN" && "bg-primary"
                    )}
                  >
                    {role}
                  </Badge>
                </li>
              ))}
          </ul>
          {!isEditing && initialData.user_role.length === 0 && (
            <p className={cn("text-sm mt-2 text-slate-500 italic")}>
              No category
            </p>
          )}
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
        {isEditing && (
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              {userRoles.map((role) => (
                <FormField
                  key={role}
                  control={form.control}
                  name="user_role"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2">
                      <FormControl>
                        <Controller
                          name="user_role"
                          control={form.control}
                          render={({ field }) => (
                            <input
                              type="checkbox"
                              value={role}
                              checked={field.value.includes(role)}
                              className="h-4 w-4 cursor-pointer accent-orange-400"
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

                      <FormDescription>{role}</FormDescription>
                    </FormItem>
                  )}
                />
              ))}

              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </form>
          </FormProvider>
        )}
      </DataCard>
    </div>
  );
};
