"use client";

import { Question } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface QuestionsListProps {
  items: Question[];
  onReorder: (updateData: { id: number; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const QuestionsList = ({
  items,
  onReorder,
  onEdit,
}: QuestionsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [questions, setQuestions] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setQuestions(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setQuestions(items);

    const bulkUpdateData = updatedChapters.map((question) => ({
      id: question.question_id,
      position: items.findIndex(
        (item) => item.question_id === question.question_id
      ),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="questions">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {questions.map((question, index) => (
              <Draggable
                key={question.question_id}
                draggableId={question.question_id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-input border-input border text-accent-foreground rounded-md mb-4 text-sm",
                      question.isPublished &&
                        "bg-muted border-input text-orange-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        question.isPublished &&
                          "border-r-orange-700 hover:bg-orange-700/30"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {question.question_title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {question.is_knockout && <Badge>Knockout</Badge>}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          question.isPublished && "bg-primary"
                        )}
                      >
                        {question.isPublished ? "Veröffentlicht" : "Entwurf"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(question.question_id.toString())}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
