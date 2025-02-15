const FileContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[calc(100vh-32rem)] p-4 md:p-8 flex w-full items-center justify-center flex-col ">
      {children}
    </div>
  );
};

export default FileContainer;
