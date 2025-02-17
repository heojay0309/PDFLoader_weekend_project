const FileContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-between gap-4 px-8 md:flex-row md:items-start lg:px-16">
      {children}
    </div>
  );
};

export default FileContainer;
