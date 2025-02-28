"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface StartQuizButtonProps {
  courseId: string;
  quizId: string;
}

export const StartQuizButtonComponent = ({
  courseId,
  quizId,
}: StartQuizButtonProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const startAttempt = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`/api/quizzes/${quizId}/quizAttempt`);
      router.push(
        `/courses/${courseId}/quiz/${quizId}/quizAttempt/${response.data.quiz_attempt_id}`
      );
    } catch {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={startAttempt} disabled={isLoading}>
      Start Quiz
    </Button>
  );
};
