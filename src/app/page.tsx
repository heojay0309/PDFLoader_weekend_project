import FileContainer from '@/components/file-container';
import FileContent from '@/components/file-contents';
import { FileUpload } from '@/components/file-upload';

export default function Home() {
  return (
    <main className="md:h-screen md:gap-8 gap-4 lg:gap-16 bg-background md:p-8 p-4 lg:p-16 flex flex-col md:flex-row w-full justify-center items-center">
      <FileContainer>
        <FileUpload />
      </FileContainer>
      <FileContent />
    </main>
  );
}
