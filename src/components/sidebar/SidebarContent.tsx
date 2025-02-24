"use client";
import Link from "next/link";

import { useUploadedFiles } from "@/lib/context/UploadedFilesContext";
import { useEffect, useState } from "react";

interface IFile {
  id: string;
  name: string;
  url: string;
  fileData: ArrayBuffer;
  fileAudio: {
    id: string;
    url: string;
    status: string;
  };
}

const SidebarContent = ({
  hide,
  pathname,
}: {
  hide: boolean;
  pathname: string;
}) => {
  const { uploadedFiles } = useUploadedFiles();
  const [files, setFiles] = useState<IFile[]>([]);
  const currentPath = pathname;

  useEffect(() => {
    if (!uploadedFiles) return;

    setFiles(uploadedFiles);
  }, [uploadedFiles]);

  return (
    <div className="hidden h-full w-full flex-col gap-8 md:flex">
      <div
        className={`flex h-full flex-1 flex-col gap-8 transition-all duration-300 ${hide ? "opacity-0" : "opacity-100"}`}
      >
        <Link href="/">
          <h3
            className={`select-none ${currentPath === "/" ? "text-white" : "text-white text-opacity-60 hover:text-opacity-80 active:text-opacity-100"}`}
          >
            Upload
          </h3>
        </Link>
        <h3 className="select-none text-white text-opacity-60">
          Uploaded Files
        </h3>
        <div className="flex flex-col gap-2 overflow-y-auto pl-2">
          {files.map((file, index) => {
            if (!file.id) return null;
            return (
              <Link
                href={`/${file.id}`}
                key={file.id}
                className={`select-none ${currentPath === `/${file.id}` ? "text-white" : "text-white text-opacity-60 hover:text-opacity-80 active:text-opacity-100"}`}
              >
                <h4 className="truncate">{file.name}</h4>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;
