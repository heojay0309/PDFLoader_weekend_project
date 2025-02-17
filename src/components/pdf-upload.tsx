"use client";
import { useRef } from "react";
import { Upload } from "lucide-react";

import { useUploadedFiles } from "@/lib/context/UploadedFilesContext";

export function FileUpload() {
  const { addFiles } = useUploadedFiles();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const uploadedFile = Array.from(event.target.files || []);

    addFiles(uploadedFile);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <div
        className="flex max-h-[320px] w-full max-w-[1/2] flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-primary lg:max-w-[1/2]"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500">.PDF files supported</p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
}
