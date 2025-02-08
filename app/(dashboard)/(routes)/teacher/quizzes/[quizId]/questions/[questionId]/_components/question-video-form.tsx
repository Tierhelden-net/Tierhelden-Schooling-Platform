"use client";

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MuxData, Question } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { Switch, SwitchThumb } from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface QuestionVideoFormProps {
  initialData: Question & { muxData?: MuxData | null };
  quizId: string;
  questionId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const QuestionVideoForm = ({
  initialData,
  questionId,
  quizId,
}: QuestionVideoFormProps) => {
  //TODO: entnehme der Datenbank, ob Video oder Bild hinterlegt ist und setze entsprechend addVideo true/false
  const [isEditing, setIsEditing] = useState(false);
  const [addVideo, setAddVideo] = useState(true);

  const toggleEdit = () => setIsEditing((current) => !current);
  const toggleAddVideo = () => setAddVideo((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //TODO: entscheide, ob Video oder Bild und lösche entsprechend das andere. Nur 1 sollte existieren.
    try {
      await axios.patch(
        `/api/quizzes/${quizId}/questions/${questionId}/actions`,
        values
      );
      toast.success("Question updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <div className="font-medium flex items-center justify-between">
        Question video or picture
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.question_video && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a visual
            </>
          )}
          {!isEditing && initialData.question_video && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit visual
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        addVideo &&
        (!initialData.question_video ? (
          <div className="flex items-center justify-center h-60 bg-input rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
          </div>
        ))}
      {!isEditing &&
        !addVideo &&
        (!initialData.question_pic ? (
          <div className="flex items-center justify-center h-60 bg-input rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.question_pic ?? ""}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <div className="flex justify-center">
            <p
              className={cn(
                "text-sm mt-2 ",
                !addVideo && "font-bold underline",
                addVideo && "text-slate-500"
              )}
            >
              Bild
            </p>
            <Switch
              className="relative mx-3 h-[25px] w-[42px] cursor-default rounded-full bg-foreground shadow-[0_2px_10px] shadow-foreground outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground data-[state=checked]:bg-foreground"
              id="random_questions"
              checked={addVideo}
              onCheckedChange={setAddVideo}
            >
              <SwitchThumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-orange-300 shadow-[0_2px_2px] shadow-black transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch>
            <p
              className={cn(
                "text-sm mt-2",
                addVideo && "underline font-bold",
                !addVideo && "text-slate-500"
              )}
            >
              Video
            </p>
          </div>
          {addVideo && (
            <div>
              <FileUpload
                endpoint="chapterVideo"
                onChange={(url) => {
                  if (url) {
                    onSubmit({ videoUrl: url });
                  }
                }}
              />
              <div className="text-xs text-muted-foreground mt-4">
                Upload this question&apos;s video
              </div>
            </div>
          )}
          {initialData.question_video && !isEditing && (
            <div className="text-xs text-muted-foreground mt-2">
              Videos can take a few minutes to process. Refresh the page if
              video does not appear.
            </div>
          )}

          {!addVideo && (
            <div>
              <FileUpload
                endpoint="courseImage"
                onChange={(url) => {
                  if (url) {
                    onSubmit({ videoUrl: url });
                  }
                }}
              />
              <div className="text-xs text-muted-foreground mt-4">
                16:9 auflösung empfohlen
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
