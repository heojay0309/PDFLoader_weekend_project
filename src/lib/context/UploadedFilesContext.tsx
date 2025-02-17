"use client";

import React, { createContext, useContext, ReactNode } from "react";

import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";

import { useFiles, useUploadFile, useDeleteFile } from "@/lib/hooks/useFiles";

interface UploadedFilesContextType {
  uploadedFiles: Array<{
    id: string;
    name: string;
    url: string;
    fileData: ArrayBuffer;
    fileAudio: {
      id: string;
      url: string;
      status: string;
    };
  }>;
  isLoading: boolean;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
}

const UploadedFilesContext = createContext<
  UploadedFilesContextType | undefined
>(undefined);

export const UploadedFilesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: uploadedFiles = [], isLoading: isLoadingFiles } = useFiles();
  const { mutate: uploadFiles, isPending: isUploading } = useUploadFile();
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile();

  const isLoading = isLoadingFiles || isUploading || isDeleting;

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }

      return fullText.trim();
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Failed to extract text from PDF");
    }
  };

  const addFiles = async (files: File[]) => {
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length > 0) {
      try {
        const extractedTexts = await Promise.all(
          pdfFiles.map(async (file) => ({
            file,
            text: await extractTextFromPDF(file),
          })),
        );

        uploadFiles(extractedTexts);
      } catch (error) {
        console.error("Error processing PDF files:", error);
      }
    }
  };

  const removeFile = (id: string) => {
    deleteFile(id);
  };

  return (
    <UploadedFilesContext.Provider
      value={{
        uploadedFiles,
        isLoading,
        addFiles,
        removeFile,
      }}
    >
      {children}
    </UploadedFilesContext.Provider>
  );
};

export const useUploadedFiles = () => {
  const context = useContext(UploadedFilesContext);
  if (!context) {
    throw new Error(
      "useUploadedFiles must be used within an UploadedFilesProvider",
    );
  }
  return context;
};
