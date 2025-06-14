import React, { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';

interface PDFViewerProps {
  file: File;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setIsLoading(false);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          className="w-full flex-1 border-0 rounded-lg"
          title="PDF Viewer"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Unable to display PDF</p>
          </div>
        </div>
      )}
    </div>
  );
};