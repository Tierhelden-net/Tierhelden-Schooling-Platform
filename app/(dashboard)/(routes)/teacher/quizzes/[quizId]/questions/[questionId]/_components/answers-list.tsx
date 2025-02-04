"use client";

import { Answer } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Check, Grip, Pencil, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AnswersListProps {
  items: Answer[];
  onReorder: (updateData: { id: number; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const AnswersList = ({ items, onReorder, onEdit }: AnswersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [answers, setAnswers] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setAnswers(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    console.log(answers);

    const items = Array.from(answers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedAnswers = items.slice(startIndex, endIndex + 1);

    setAnswers(items);

    const bulkUpdateData = updatedAnswers.map((answer) => ({
      id: answer.answer_id,
      position: items.findIndex((item) => item.answer_id === answer.answer_id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="answers">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {answers.map((answer, index) => (
              <Draggable
                key={answer.answer_id}
                draggableId={answer.answer_id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-input border-input border text-accent-foreground rounded-md mb-4 text-sm",
                      answer.is_correct && "border-input text-green-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        answer.is_correct &&
                          "border-r-green-700 hover:bg-green-700/30"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {answer.answer_text}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {answer.is_correct ? <Check></Check> : <X></X>}

                      <Pencil
                        onClick={() => onEdit(answer.answer_id.toString())}
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
