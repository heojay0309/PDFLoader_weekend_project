'use client';
import Link from 'next/link';
import { ChevronRight, Trash } from 'lucide-react';

import FileContainer from './file-container';
import { Button } from './ui/button';

import { useUploadedFiles } from '@/context/UploadedFilesContext';

const FileContent = () => {
  const { uploadedFiles, removeFile, isLoading } = useUploadedFiles();

  if (uploadedFiles.length === 0) {
    return;
  }

  return (
    <FileContainer>
      <div className="border rounded-2xl  max-h-full relative  border-white/10 flex w-full flex-col max-w-2xl p-4 justify-between gap-4">
        <h4 className="">YOUR PLAYNOTES</h4>
        <div className="flex flex-col gap-4 flex-1 h-full overflow-y-auto">
          <div>{isLoading ? 'Loading...' : ''}</div>
          {uploadedFiles.map((file, index) => (
            <div
              role="button"
              key={index}
              className="flex min-h-[64px] text-white bg-[#191919] hover:bg-[#191919] active:bg-[#191919] border-primary/20 w-full hover:border-primary/60 active:border-primary/80 gap-2 border p-4 rounded-2xl border-white/10 justify-between items-center "
            >
              <p className="flex-1 text-left">{file.name}</p>
              <Link
                href={`/${file.name}`}
                className="border rounded-xl h-[40px] px-4 border-white/10 py-2 flex items-center gap-2 justify-center"
              >
                <h4>View</h4>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </FileContainer>
  );
};

export default FileContent;
