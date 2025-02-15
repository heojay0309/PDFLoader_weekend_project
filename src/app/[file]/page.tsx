import PDFViewer from '@/components/pdf-viewer';
import AudioController from '@/components/audio-controller';
export function decodeFilename(encodedFilename: string): string {
  return decodeURIComponent(encodedFilename);
}

const FilePage = async ({ params }: { params: Promise<{ file: string }> }) => {
  const file = decodeFilename((await params).file);
  // 0f392c81-2e0b-42cc-bf11-4b7d18be2ac2
  return (
    <main className="bg-background md:p-8 p-4 lg:px-16 flex flex-col md:flex-row w-full justify-center">
      <div className="flex-1 h-full flex w-full items-start justify-start flex-col ">
        <PDFViewer file={file} />
      </div>
      <AudioController file={file} />
    </main>
  );
};

export default FilePage;
