"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface StartQuizButtonProps {
  courseId: string;
  quizId: string;
}

export const StartQuizButtonComponent = ({
  courseId,
  quizId,
}: StartQuizButtonProps) => {
  const router = useRouter();

  const startAttempt = async () => {
    try {
      const response = await axios.post(`/api/quizzes/${quizId}/quizAttempt`);
      router.push(
        `/courses/${courseId}/quiz/${quizId}/quizAttempt/${response.data.quiz_attempt_id}`
      );
    } catch {
      toast.error("Something went wrong");
    }
  };

  return <Button onClick={startAttempt}>Start Quiz</Button>;
};
