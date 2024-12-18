import QuizComponent from "@/components/quiz";
import React from "react";
import { DataCard } from "../../teacher/analytics/_components/data-card";

function QuizPage() {
  return (
    <div className="p-6">
      <DataCard label="Quiz">
        <QuizComponent />
      </DataCard>
    </div>
  );
}

export default QuizPage;
