"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import * as pdfjs from "pdfjs-dist";

import { Button } from "@/components/ui/button";

import { useUploadedFiles } from "@/lib/context/UploadedFilesContext";

import "pdfjs-dist/build/pdf.worker.mjs";

const PDFViewer = ({ fileUrl }: { fileUrl: string }) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { uploadedFiles } = useUploadedFiles();

  useEffect(() => {
    if (!uploadedFiles) return;

    const loadPDF = async () => {
      setIsLoading(true);
      const loadingTask = pdfjs.getDocument(fileUrl);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      renderPage(pageNum, pdf);
      setIsLoading(false);
    };
    loadPDF();
  }, [uploadedFiles]);

  const renderPage = async (num: number, pdf: pdfjs.PDFDocumentProxy) => {
    if (!canvasRef.current) return;

    const page = await pdf.getPage(num);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current as HTMLCanvasElement & {
      renderTask?: pdfjs.RenderTask;
    };
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cancel any previous rendering task
    if (canvas && canvas.renderTask) {
      canvas.renderTask.cancel();
    }

    // Adjust canvas size
    if (canvas) {
      canvas.height = viewport.height;
    }
    canvas.width = viewport.width;

    // Start new render task
    const renderTask = page.render({ canvasContext: ctx, viewport });
    canvas.renderTask = renderTask;

    try {
      await renderTask.promise;
    } catch (error) {
      if (error instanceof pdfjs.RenderingCancelledException) {
        console.log("Rendering canceled:", num);
      } else {
        console.error("Render error:", error);
      }
    }
  };
  const handlePrevPage = () => {
    if (pageNum > 1 && pdfDoc) {
      const newPage = pageNum - 1;
      setPageNum(newPage);
      renderPage(newPage, pdfDoc);
    }
  };

  const handleNextPage = () => {
    if (pdfDoc && pageNum < (numPages || 0)) {
      const newPage = pageNum + 1;
      setPageNum(newPage);
      renderPage(newPage, pdfDoc);
    }
  };

  const handlePageChange = () => {
    if (!pageNum || pageNum < 1) {
      setPageNum(1);
    }

    if (pdfDoc) {
      renderPage(pageNum, pdfDoc);
    }
  };

  return (
    <div className="flex h-full w-full flex-col-reverse items-center justify-center gap-4 md:flex-col">
      <div className="flex w-full items-center justify-center gap-4">
        <Button
          onClick={handlePrevPage}
          disabled={pageNum <= 1}
          className="flex h-[40px] w-[40px] select-none items-center justify-center rounded-full bg-[#141A10] text-[#b4fd83] hover:bg-[#141A10]/80 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <p className="select-none">Page</p>
          <input
            className="h-6 w-8 border-b border-[#b4fd83] bg-transparent text-center text-[#b4fd83] ring-0 focus:select-all focus:rounded-[8px] focus:border focus:outline-none focus:ring-0 [&::-moz-number-spin-box]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            type="number"
            value={pageNum === 0 ? "" : pageNum}
            min={1}
            max={numPages || 1}
            onChange={(e) => {
              const value = e.target.value;
              const numericValue = Number(value);
              setPageNum(numericValue);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handlePageChange();
              }
            }}
            onBlur={() => {
              handlePageChange();
            }}
          />
          <p className="select-none">of</p>
          <p className="select-none"> {numPages || "..."}</p>
        </div>
        <Button
          onClick={handleNextPage}
          disabled={pageNum >= (numPages || 0)}
          className="flex h-[40px] w-[40px] select-none items-center justify-center rounded-full bg-[#141A10] text-[#b4fd83] hover:bg-[#141A10]/80 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {isLoading && (
        <div className="flex h-full max-h-[80vh] min-h-[80vh] items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      <canvas
        id="canvas"
        ref={canvasRef}
        className="h-full max-h-[80vh] max-w-[80vw] overflow-y-auto"
      />
    </div>
  );
};

export default PDFViewer;
