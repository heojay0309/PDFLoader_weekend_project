'use client';
import { Upload } from 'lucide-react';
import { useRef } from 'react';

import { useUploadedFiles } from '@/context/UploadedFilesContext';

export function FileUpload() {
  const { addFiles, uploadedFiles } = useUploadedFiles(); // Use the custom hook
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile = Array.from(event.target.files || []);

    addFiles(uploadedFile);
  };

  return (
    <div className="flex justify-start h-full w-full max-w-2xl flex-col gap-8">
      {uploadedFiles.length === 0 ? (
        <div className="flex flex-col gap-4 h-full ">
          <h1 className="text-4xl font-bold text-center">
            PDF Upload & Text-to-Speech
          </h1>
          <p className="text-center text-muted-foreground">
            Upload your PDF files and convert text to speech using Play.ai
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-center">
            PDF Upload & Text-to-Speech
          </h1>
        </div>
      )}
      <div
        className="border-2 border-dashed border-gray-300 flex-1 items-center justify-center flex flex-col w-full rounded-2xl p-8 text-center hover:border-primary cursor-pointer"
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

// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { Upload, FileText, Play, Pause, Trash } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import * as pdfjsLib from 'pdfjs-dist';
// import 'pdfjs-dist/build/pdf.worker.mjs';

// // import { toast } from 'sonner';
// // import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';
// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';

// export function FileUpload() {
//   const [files, setFiles] = useState<File[]>([]);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentText, setCurrentText] = useState('');
//   const [progress, setProgress] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
//   }, []);

//   const extractTextFromPDF = async (file: File): Promise<string> => {
//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//       let fullText = '';

//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const textContent = await page.getTextContent();
//         const pageText = textContent.items
//           .map((item: any) => item.str)
//           .join(' ');
//         fullText += pageText + '\n';
//       }

//       return fullText.trim();
//     } catch (error) {
//       console.error('Error extracting text from PDF:', error);
//       throw new Error('Failed to extract text from PDF');
//     }
//   };

//   const handleFileUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const uploadedFiles = Array.from(event.target.files || []);
//     setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);

//     for (const file of uploadedFiles) {
//       if (file.type === 'application/pdf') {
//         setIsLoading(true);
//         try {
//           const text = await extractTextFromPDF(file);
//           setCurrentText(text);
//           // toast.success('PDF text extracted successfully');
//         } catch (error) {
//           console.error('Error extracting text from PDF:', error);
//           // toast.error('Failed to extract text from PDF');
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     }
//   };

//   const handlePlayPause = async () => {
//     if (!currentText) return;

//     if (isPlaying) {
//       audioRef.current?.pause();
//       setIsPlaying(false);
//       return;
//     }

//     try {
//       // const response = await fetch('/api/tts', {
//       //   method: 'POST',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify({ text: currentText }),
//       // });

//       // if (!response.ok) throw new Error('TTS request failed');

//       // const data = await response.json();

//       if (audioRef.current) {
//         // audioRef.current.src = data.url;
//         audioRef.current.src =
//           'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

//         audioRef.current.play();
//         setIsPlaying(true);
//       }
//     } catch (error) {
//       console.error('Error generating speech:', error);
//       // toast.error('Failed to generate speech');
//     }
//   };

//   const removeFile = (index: number) => {
//     setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//     if (files.length === 1) {
//       setCurrentText('');
//     }
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
//       <div
//         className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary cursor-pointer"
//         onClick={() => fileInputRef.current?.click()}
//       >
//         <Upload className="mx-auto h-12 w-12 text-gray-400" />
//         <p className="mt-2 text-sm text-gray-600">
//           Click to upload or drag and drop
//         </p>
//         <p className="text-xs text-gray-500">PDF files supported</p>
//         <input
//           ref={fileInputRef}
//           type="file"
//           className="hidden"
//           accept=".pdf"
//           onChange={handleFileUpload}
//           multiple
//         />
//       </div>

//       {files.length > 0 && (
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Uploaded Files</h3>
//           {files.map((file, index) => (
//             <div
//               key={index}
//               className="flex items-center justify-between p-4 bg-gray-50 rounded-lg text-black"
//             >
//               <div className="flex items-center space-x-3">
//                 <FileText className="h-6 w-6 text-blue-500" />
//                 <span className="text-sm font-medium">{file.name}</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => removeFile(index)}
//                 >
//                   <Trash className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {isLoading && (
//         <div className="text-center">
//           <Progress value={undefined} className="w-full mb-2" />
//           <p className="text-sm text-muted-foreground">
//             Extracting text from PDF...
//           </p>
//         </div>
//       )}

//       {currentText && !isLoading && (
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <Button
//               onClick={handlePlayPause}
//               variant="outline"
//               className="flex items-center space-x-2"
//             >
//               {isPlaying ? (
//                 <Pause className="h-4 w-4" />
//               ) : (
//                 <Play className="h-4 w-4" />
//               )}
//               <span>{isPlaying ? 'Pause' : 'Play'}</span>
//             </Button>
//             <Progress value={progress} className="w-64" />
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h4 className="font-semibold mb-2">Extracted Text</h4>
//             <div className="max-h-60 overflow-y-auto">
//               <p className="whitespace-pre-wrap text-sm">{currentText}</p>
//             </div>
//           </div>
//           <audio
//             ref={audioRef}
//             onTimeUpdate={(e) => {
//               const audio = e.currentTarget;
//               setProgress((audio.currentTime / audio.duration) * 100);
//             }}
//             onEnded={() => {
//               setIsPlaying(false);
//               setProgress(0);
//             }}
//             className="hidden"
//           />
//         </div>
//       )}
//     </div>
//   );
// }
