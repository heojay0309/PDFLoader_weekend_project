import Link from "next/link";

import PDFViewer from "@/components/pdf-viewer";
import AudioController from "@/components/audio-controller";
import { Button } from "@/components/ui/button";

import prisma from "@/utils/prisma/prisma";

const FilePage = async ({ params }: { params: Promise<{ file: string }> }) => {
  const file = (await params).file;

  // Get the file from the database
  const fileId = await prisma.uploadedFile.findUnique({
    where: { id: file },
    include: {
      fileAudio: true,
    },
  });

  return (
    <main className="relative flex h-full w-full flex-col items-center">
      <div className="flex h-[80px] w-full max-w-[50%] items-center justify-center px-4 md:max-w-none md:justify-start md:px-16">
        <h2 className="select-none truncate">{fileId?.name || ""}</h2>
      </div>
      {fileId ? (
        <>
          <div className="flex h-full max-h-[70vh] w-full flex-1 flex-col items-start justify-start md:max-h-[70vh]">
            <PDFViewer fileUrl={fileId?.url ? String(fileId.url) : ""} />
          </div>
          <AudioController
            fileAudio={
              fileId?.fileAudio?.url ? String(fileId.fileAudio.url) : ""
            }
            fileName={fileId?.name ? String(fileId.name) : ""}
          />
        </>
      ) : (
        <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-8 p-4 md:p-8 lg:px-16">
          <h2>File Could Not Be Found</h2>
          <Button variant="outline" className="rounded-xl" asChild>
            <Link href="/">Go Back</Link>
          </Button>
        </div>
      )}
    </main>
  );
};

export default FilePage;
