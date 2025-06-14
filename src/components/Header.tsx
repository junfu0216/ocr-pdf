import React from 'react';
import { ArrowLeft, Download, FileText } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasData: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, hasData }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Statement Converter</h1>
              <p className="text-sm text-gray-500">AI-Powered Data Extraction</p>
            </div>
          </div>
          
          {hasData && (
            <button
              onClick={onReset}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 
                         hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>New Upload</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};