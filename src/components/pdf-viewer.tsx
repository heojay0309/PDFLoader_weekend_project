'use client';

import { useEffect, useState, useRef } from 'react';
import { useUploadedFiles } from '@/context/UploadedFilesContext';
import { Button } from './ui/button';
import * as pdfjs from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';

pdfjs.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';

const PDFViewer = ({ file }: { file: string }) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { pdfUrl } = useUploadedFiles();

  useEffect(() => {
    if (!pdfUrl) return;
    const loadPDF = async () => {
      const fileUrl = pdfUrl.find((url) => url.name === file)?.url;

      if (!fileUrl) {
        return;
      }
      const loadingTask = pdfjs.getDocument(fileUrl);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      renderPage(pageNum, pdf);
    };
    loadPDF();
  }, []);

  const renderPage = async (num: number, pdf: pdfjs.PDFDocumentProxy) => {
    if (!canvasRef.current) return;

    const page = await pdf.getPage(num);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current as HTMLCanvasElement & {
      renderTask?: pdfjs.RenderTask;
    };
    const ctx = canvas.getContext('2d');
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
    canvas.renderTask = renderTask; // Store it on the canvas object

    try {
      await renderTask.promise;
    } catch (error) {
      if (error instanceof pdfjs.RenderingCancelledException) {
        console.log('Rendering canceled:', num);
      } else {
        console.error('Render error:', error);
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
    <div className="flex flex-col items-center gap-4 justify-center w-full">
      <h1 className="font-bold">PDF Viewer</h1>
      <div className="flex items-center gap-2 w-full justify-between">
        <Button
          onClick={handlePrevPage}
          disabled={pageNum <= 1}
          className="flex items-center justify-center h-[40px] w-[120px] text-[#b4fd83] select-none bg-[#141A10] hover:bg-[#141A10]/80 rounded disabled:opacity-50"
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <p className="select-none">Page</p>
          <input
            className="w-8 h-6 ring-0 focus:rounded-[8px] bg-transparent focus:select-all focus:border border-b border-[#b4fd83] text-[#b4fd83] text-center focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-number-spin-box]:appearance-none"
            type="number"
            value={pageNum === 0 ? '' : pageNum}
            min={1}
            max={numPages || 1}
            onChange={(e) => {
              const value = e.target.value;
              const numericValue = Number(value);
              setPageNum(numericValue);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handlePageChange();
              }
            }}
            onBlur={() => {
              handlePageChange();
            }}
          />
          <p className="select-none">of</p>
          <p className="select-none text-[#b4fd83]"> {numPages || '...'}</p>
        </div>
        <Button
          onClick={handleNextPage}
          disabled={pageNum >= (numPages || 0)}
          className="flex items-center justify-center h-[40px] w-[120px] text-[#b4fd83] select-none bg-[#141A10] hover:bg-[#141A10]/80 rounded disabled:opacity-50"
        >
          Next
        </Button>
      </div>
      <canvas
        id="canvas"
        ref={canvasRef}
        className="border overflow-y-auto max-h-[80vh] h-full"
      />
    </div>
  );
};

export default PDFViewer;
