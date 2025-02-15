'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';

interface UploadedFilesContextType {
  uploadedFiles: File[];
  isLoading: boolean;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  pdfUrl: { name: string; url: string; ttsUrl: string }[];
}

const UploadedFilesContext = createContext<
  UploadedFilesContextType | undefined
>(undefined);

export const UploadedFilesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<
    { name: string; url: string; ttsUrl: string }[]
  >([]);

  const addFiles = async (files: File[]) => {
    setIsLoading(true);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);

    if (files.length > 0) {
      const extractedFiles = files.map(async (file) => {
        if (file.type === 'application/pdf') {
          try {
            const objectUrl = URL.createObjectURL(file);
            const text = await extractTextFromPDF(file);
            const ttsUrl = await generateTTSUrl(text);
            setPdfUrl((prevUrls) => [
              ...prevUrls,
              { name: file.name, url: objectUrl, ttsUrl: ttsUrl },
            ]);
          } catch (error) {
            console.error('Error processing PDF file:', error);
          }
        } else {
          console.warn('File is not a valid PDF:', file.name);
        }
      });
      await Promise.all(extractedFiles);
    }
    setIsLoading(false);
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return fullText.trim();
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  const generateTTSUrl = async (text: string) => {
    const response = await fetch('/api/tts', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    console.log('response', data);

    return data.id;
    // 0f392c81-2e0b-42cc-bf11-4b7d18be2ac2;
  };
  const removeFile = (index: number) => {
    setUploadedFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      if (pdfUrl[index]) {
        URL.revokeObjectURL(pdfUrl[index].url);
      }
      return newFiles;
    });
  };

  return (
    <UploadedFilesContext.Provider
      value={{
        pdfUrl,
        isLoading,
        uploadedFiles,
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
      'useUploadedFiles must be used within an UploadedFilesProvider'
    );
  }
  return context;
};

// 'use client';
// import React, { createContext, useContext, useState, ReactNode } from 'react';

// import * as pdfjsLib from 'pdfjs-dist';
// import 'pdfjs-dist/build/pdf.worker.mjs';

// interface UploadedFilesContextType {
//   uploadedFiles: File[];
//   isLoading: boolean;
//   addFiles: (files: File[]) => void;
//   removeFile: (index: number) => void;
//   pdfUrl: { name: string; url: string }[];
// }

// const UploadedFilesContext = createContext<
//   UploadedFilesContextType | undefined
// >(undefined);

// export const UploadedFilesProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState<{ name: string; url: string }[]>([]);

//   const addFiles = async (files: File[]) => {
//     console.log('files', files);
//     setIsLoading(true);
//     setUploadedFiles((prevFiles) => [...prevFiles, ...files]);

//     if (files.length > 0) {
//       const extractedFiles = files.map(async (file) => {
//         if (file.type === 'application/pdf') {
//           // await extractTextFromPDF(file);
//         }
//         setPdfUrl((prevUrls) => [...prevUrls, { name: file.name, url: URL.createObjectURL(file) }]);
//       });
//       console.log('extractedFiles', extractedFiles);
//       // if (file.type === 'application/pdf') {
//       //   // setIsLoading(true);
//       //   try {
//       //     const text = await extractTextFromPDF(file);
//       //     console.log(text);
//       //     // setCurrentText(text);
//       //   } catch (error) {
//       //     console.error('Error extracting text from PDF:', error);
//       //   } finally {
//       //     // setIsLoading(false);
//       //   }
//       // }
//     }
//     setIsLoading(false);
//   };

//   // const extractTextFromPDF = async (file: File): Promise<string> => {
//   //   try {
//   //     const arrayBuffer = await file.arrayBuffer();
//   //     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//   //     let fullText = '';

//   //     for (let i = 1; i <= pdf.numPages; i++) {
//   //       const page = await pdf.getPage(i);
//   //       const textContent = await page.getTextContent();
//   //       const pageText = textContent.items
//   //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   //         .map((item: any) => item.str)
//   //         .join(' ');
//   //       fullText += pageText + '\n';
//   //     }

//   //     return fullText.trim();
//   //   } catch (error) {
//   //     console.error('Error extracting text from PDF:', error);
//   //     throw new Error('Failed to extract text from PDF');
//   //   }
//   // };

//   const removeFile = (index: number) => {
//     setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//   };

//   return (
//     <UploadedFilesContext.Provider
//       value={{
//         pdfUrl,
//         isLoading,
//         uploadedFiles,
//         addFiles,
//         removeFile,
//       }}
//     >
//       {children}
//     </UploadedFilesContext.Provider>
//   );
// };

// export const useUploadedFiles = () => {
//   const context = useContext(UploadedFilesContext);
//   if (!context) {
//     throw new Error(
//       'useUploadedFiles must be used within an UploadedFilesProvider'
//     );
//   }
//   return context;
// };
