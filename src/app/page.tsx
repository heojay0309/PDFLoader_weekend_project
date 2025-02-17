import FileContainer from "@/components/file-container";
import FileContent from "@/components/file-contents";
import { FileUpload } from "@/components/pdf-upload";

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col items-center">
      <div className="flex h-[80px] w-full items-center justify-center px-4 md:justify-start md:px-16">
        <h2 className="select-none">PDF Upload</h2>
      </div>
      <FileContainer>
        <FileUpload />
        <FileContent />
      </FileContainer>
    </main>
  );
}
