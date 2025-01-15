"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface QuestionActionsProps {
  disabled: boolean;
  quizId: number;
  questionsId: string;
  isPublished: boolean;
}

export const QuestionActions = ({
  disabled,
  quizId,
  questionsId,
  isPublished,
}: QuestionActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/quizzes/${quizId}/questions/${questionsId}/unpublish`
        );
        toast.success("Frage nicht mehr veröffentlicht");
      } else {
        await axios.patch(
          `/api/quizzes/${quizId}/questions/${questionsId}/publish`
        );
        toast.success("Frage veröffentlicht");
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/quizzes/${quizId}/questiions/${questionsId}`);

      toast.success("Frage gelöscht");
      router.refresh();
      router.push(`/teacher/quizzes/${quizId}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Veröffentlichung aufheben" : "Veröffentlichen"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
