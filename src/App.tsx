import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { SplitView } from './components/SplitView';
import { ExportPanel } from './components/ExportPanel';
import { Header } from './components/Header';
import { TransactionData } from './types/Transaction';
import { processStatementWithGemini, processDemoData } from './services/geminiService';

function App() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<TransactionData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      // Try to use Gemini API first, fallback to demo data if API key is not available
      const result = await processStatementWithGemini(file);
      
      if (result.success && result.data) {
        setExtractedData(result.data);
      } else {
        // If Gemini fails, show error and use demo data
        if (result.error) {
          setProcessingError(result.error);
          console.warn('Gemini processing failed, using demo data:', result.error);
        }
        
        // Use demo data as fallback
        const demoResult = await processDemoData(file);
        if (demoResult.success && demoResult.data) {
          setExtractedData(demoResult.data);
        }
      }
    } catch (error) {
      console.error('Processing error:', error);
      setProcessingError('ファイルの処理中にエラーが発生しました。');
      
      // Use demo data as final fallback
      const demoResult = await processDemoData(file);
      if (demoResult.success && demoResult.data) {
        setExtractedData(demoResult.data);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDataUpdate = (updatedData: TransactionData[]) => {
    setExtractedData(updatedData);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setExtractedData([]);
    setIsProcessing(false);
    setProcessingError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header onReset={handleReset} hasData={extractedData.length > 0} />
      
      <main className="container mx-auto px-4 py-8">
        {!uploadedFile ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AI搭載 銀行取引明細書コンバーター
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                PDFの銀行取引明細書をAIで自動解析し、構造化されたデータに変換します。
                アップロード、確認、編集、エクスポートまで数秒で完了。
              </p>
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
            
            {/* API Key Setup Instructions */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-3">🔧 Gemini API設定</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p>実際のAI処理を使用するには、Gemini API キーが必要です：</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li><a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Google AI Studio</a>でAPIキーを取得</li>
                  <li>環境変数 <code className="bg-blue-100 px-2 py-1 rounded">VITE_GEMINI_API_KEY</code> に設定</li>
                  <li>アプリケーションを再起動</li>
                </ol>
                <p className="text-xs mt-2">APIキーが設定されていない場合は、デモデータが表示されます。</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {processingError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
                  <div>
                    <h4 className="font-medium text-yellow-800">処理に関する注意</h4>
                    <p className="text-sm text-yellow-700 mt-1">{processingError}</p>
                    <p className="text-xs text-yellow-600 mt-2">現在はデモデータを表示しています。</p>
                  </div>
                </div>
              </div>
            )}
            
            <SplitView 
              file={uploadedFile}
              data={extractedData}
              isProcessing={isProcessing}
              onDataUpdate={handleDataUpdate}
            />
            {extractedData.length > 0 && (
              <ExportPanel data={extractedData} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;