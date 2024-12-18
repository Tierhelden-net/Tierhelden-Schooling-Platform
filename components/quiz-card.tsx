import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { CourseProgress } from "@/components/course-progress";

interface QuizCardProps {
  id: string;
  title: string;
  questionsCount: number;
  progress: number | null;
  category: string;
}

export const QuizCard = ({
  id,
  title,
  questionsCount,
  progress,
  category,
}: QuizCardProps) => {
  return (
    <Link href={`/quiz/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-orange-300 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={HelpCircle} />
              <span>{questionsCount} Fragen</span>
            </div>
          </div>
          {progress !== null && (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          )}
        </div>
      </div>
    </Link>
  );
};
