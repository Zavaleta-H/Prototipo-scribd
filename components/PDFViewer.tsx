import React, { useEffect, useRef } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PDFViewer({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    async function render() {
      try {
        const loadingTask = getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.25 });
        const canvas = canvasRef.current!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;
      } catch (err) {
        console.error('Error render PDF', err);
      }
    }
    render();
    return () => { cancelled = true; };
  }, [url]);

  return <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />;
}
