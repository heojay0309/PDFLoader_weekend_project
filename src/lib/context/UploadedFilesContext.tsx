"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";

import { useFiles, useUploadFile, useDeleteFile } from "@/lib/hooks/useFiles";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  fileData: ArrayBuffer | File;
  fileAudio: {
    id: string;
    url: string;
    status: string;
  };
  isLoading: boolean;
}

interface UploadedFilesContextType {
  uploadedFiles: UploadedFile[];
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
  const { data: initialUploadedFiles = [], isLoading: isLoadingFiles } =
    useFiles();
  const { mutate: uploadFiles, isPending: isUploading } = useUploadFile();
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[] | []>([]);

  useEffect(() => {
    console.log("updated Initial", initialUploadedFiles);
    if (initialUploadedFiles.length > 0) {
      setUploadedFiles(initialUploadedFiles);
    }
  }, [initialUploadedFiles]);

  const isLoading = isLoadingFiles || isUploading || isDeleting;

  const extractTextFromPDF = async (
    file: File,
    chunkSize: number = 9000,
  ): Promise<string[]> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      let chunks: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");

        fullText += pageText + "\n";
        fullText = fullText.replace(/\s{2,}/g, " ");

        // If fullText reaches the limit, push it to chunks and reset
        while (fullText.length >= chunkSize) {
          chunks.push(fullText.substring(0, chunkSize));
          fullText = fullText.substring(chunkSize);
        }
      }
      // Push any remaining text
      if (fullText.trim().length > 0) {
        chunks.push(fullText.trim());
      }
      return chunks;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Failed to extract text from PDF");
    }
  };

  const addFiles = async (files: File[]) => {
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length > 0) {
      // Await the promises before setting state
      const updatedFiles = await Promise.all(
        pdfFiles.map(async (singleFile) => ({
          id: singleFile.name,
          name: singleFile.name,
          url: "",
          fileData: singleFile,
          fileAudio: { id: "", url: "", status: "IN_PROGRESS" },
          isLoading: true,
        })),
      );

      setUploadedFiles((prev) => [...prev, ...updatedFiles]);

      try {
        const extractedTexts = await Promise.all(
          updatedFiles.map(async (file) => ({
            file: file.fileData,
            text: (await extractTextFromPDF(file.fileData))[0],
          })),
        );
        await uploadFiles(extractedTexts);
        // Update the uploadedFiles state to set isLoading to false
        setUploadedFiles((prev) =>
          prev.map((file) =>
            updatedFiles.some((updatedFile) => updatedFile.id === file.id)
              ? { ...file, isLoading: false }
              : file,
          ),
        );
      } catch (error) {
        console.error("Error processing PDF files:", error);
      }
    } else {
      return "No PDFs found. Please upload valid files.";
    }
  };

  const removeFile = async (id: string) => {
    await deleteFile(id);
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
