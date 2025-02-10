"use client";

import { CheckCircle, GraduationCap, Lock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface CourseSidebarQuizItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

export const CourseSidebarQuizItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarQuizItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : GraduationCap;
  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/quiz/${id}`);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      disabled={isLocked}
      className={cn(
        "flex items-center gap-x-2 text-inactive text-sm font-[500] pl-6 transition-all hover:text-inactive-hover hover:bg-slate-300/20",
        isActive &&
          "text-active bg-slate-500/20 hover:bg-slate-200/20 hover:text-active",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20",
        isLocked && "text-disabled hover:text-disabled hover:bg-transparent "
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-inactive",
            isActive && "text-active",
            isCompleted && "text-emerald-700",
            isLocked && "text-disabled"
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700"
        )}
      />
    </button>
  );
};
