"use client";

import Link from "next/link";
import { ChevronRight, Trash, Loader, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useUploadedFiles } from "@/lib/context/UploadedFilesContext";

const FileContent = () => {
  const { uploadedFiles, removeFile, isLoading } = useUploadedFiles();

  if (uploadedFiles.length === 0) {
    return;
  }

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <div className="relative flex max-h-full min-h-[320px] w-full max-w-[1/2] flex-col justify-between gap-4 rounded-2xl border border-white/10 p-4">
        <h4 className="">YOUR PLAYNOTES</h4>
        <div className="flex h-full flex-1 flex-col gap-4 overflow-y-auto">
          {uploadedFiles.map((file, index) => {
            return (
              <div
                role="button"
                key={index}
                className="flex min-h-[64px] w-full flex-col items-center justify-between gap-2 rounded-2xl border border-white/10 bg-[#191919] p-4 text-white"
              >
                <div className="flex w-full items-center justify-between gap-2">
                  {file.fileAudio && (
                    <div
                      className={`mr-2 flex h-[40px] w-[40px] items-center justify-center rounded-full border border-white/10 ${file.fileAudio.status.toLowerCase() === "in_progress" ? "bg-yellow-500" : file.fileAudio.status.toLowerCase() === "completed" ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {file.fileAudio.status.toLowerCase() === "in_progress" ? (
                        <Loader />
                      ) : file.fileAudio.status.toLowerCase() ===
                        "completed" ? (
                        <Check />
                      ) : (
                        <X />
                      )}
                    </div>
                  )}
                  <p className="flex-1 text-left">{file.name}</p>
                  <Link
                    href={`/${file.id}`}
                    className="flex h-[40px] items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 hover:border-primary/40 hover:bg-primary/10"
                  >
                    <h4>View</h4>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                    className="h-[40px] w-[40px] rounded-full"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          {isLoading ? (
            <div className="flex min-h-[64px] w-full flex-col items-center justify-between gap-2 rounded-2xl border border-white/10 bg-[#191919] p-4 text-white hover:border-primary/60 hover:bg-[#191919] active:border-primary/80 active:bg-[#191919]">
              <h4>Loading...</h4>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileContent;
