import Link from "next/link";

import { useUploadedFiles } from "@/lib/context/UploadedFilesContext";

const SidebarContentMobile = ({
  hide,
  pathname,
  handleToggle,
}: {
  hide: boolean;
  pathname: string;
  handleToggle: () => void;
}) => {
  const currentPath = pathname;
  const { uploadedFiles } = useUploadedFiles();

  return (
    <div className="flex h-full w-full flex-col gap-8 p-[32px]">
      <div
        className={`flex h-full flex-1 flex-col gap-8 transition-all duration-300 ${hide ? "opacity-0" : "opacity-100"}`}
      >
        <Link href="/" onClick={handleToggle}>
          <h3
            className={`select-none ${currentPath === "/" ? "text-white" : "text-white text-opacity-60 hover:text-opacity-80 active:text-opacity-100"}`}
          >
            Upload
          </h3>
        </Link>
        <h3 className="select-none text-white text-opacity-60">
          Uploaded Files
        </h3>
        <div className="flex flex-col gap-2 overflow-y-auto pl-2">
          {uploadedFiles.map((file) => {
            if (!file.id) return null;

            return (
              <Link
                href={`/${file.id}`}
                key={file.id}
                className={`select-none ${currentPath === `/${file.id}` ? "text-white" : "text-white text-opacity-60 hover:text-opacity-80 active:text-opacity-100"}`}
              >
                <h4 className="truncate">{file.name}</h4>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarContentMobile;
