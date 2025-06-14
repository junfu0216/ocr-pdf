import React from 'react';
import { PDFViewer } from './PDFViewer';
import { DataTable } from './DataTable';
import { TransactionData } from '../types/Transaction';

interface SplitViewProps {
  file: File;
  data: TransactionData[];
  isProcessing: boolean;
  onDataUpdate: (data: TransactionData[]) => void;
}

export const SplitView: React.FC<SplitViewProps> = ({ 
  file, 
  data, 
  isProcessing, 
  onDataUpdate 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Original Document</h3>
          <p className="text-sm text-gray-500">{file.name}</p>
        </div>
        <div className="p-6 h-full">
          <PDFViewer file={file} />
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Extracted Data</h3>
          <p className="text-sm text-gray-500">
            {isProcessing ? 'AI is processing...' : `${data.length} transactions found`}
          </p>
        </div>
        <div className="h-full">
          <DataTable 
            data={data} 
            isProcessing={isProcessing}
            onDataUpdate={onDataUpdate}
          />
        </div>
      </div>
    </div>
  );
};