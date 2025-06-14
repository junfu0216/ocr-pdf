import { GoogleGenerativeAI } from '@google/generative-ai';
import { TransactionData } from '../types/Transaction';

// Gemini API configuration
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface ProcessingResult {
  success: boolean;
  data?: TransactionData[];
  error?: string;
}

export const processStatementWithGemini = async (file: File): Promise<ProcessingResult> => {
  if (!genAI) {
    return {
      success: false,
      error: 'Gemini API key not configured. Please set VITE_GEMINI_API_KEY environment variable.'
    };
  }

  try {
    // Convert PDF to base64
    const base64Data = await fileToBase64(file);
    
    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Create the prompt for bank statement analysis
    const prompt = `
あなたは銀行取引明細書を分析する専門AIです。アップロードされたPDFファイルから取引データを抽出し、JSON形式で構造化してください。

以下の形式で出力してください：

{
  "transactions": [
    {
      "id": "unique_id",
      "date": "YYYY-MM-DD",
      "description": "取引内容の説明",
      "debit": 支払金額（数値、支払いがない場合は0）,
      "credit": 入金金額（数値、入金がない場合は0）,
      "balance": 残高（数値）,
      "category": "推定カテゴリ（例：食費、交通費、給与など）",
      "isValid": true
    }
  ]
}

重要な注意事項：
1. 日付は必ずYYYY-MM-DD形式で統一してください
2. 金額は数値型で、カンマや通貨記号は含めないでください
3. 支払いと入金を正確に区別してください
4. 残高の計算が正しいかチェックしてください
5. 取引内容から適切なカテゴリを推定してください
6. 各取引に一意のIDを付与してください
7. JSONのみを返し、他の説明文は含めないでください

PDFから読み取れない部分や不明な部分がある場合は、isValidをfalseに設定してください。
`;

    // Process the PDF with Gemini
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type,
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      
      if (!parsedData.transactions || !Array.isArray(parsedData.transactions)) {
        throw new Error('Invalid response format');
      }

      // Validate and clean the data
      const cleanedTransactions: TransactionData[] = parsedData.transactions.map((transaction: any, index: number) => ({
        id: transaction.id || `transaction_${index + 1}`,
        date: transaction.date || new Date().toISOString().split('T')[0],
        description: transaction.description || '不明な取引',
        debit: Number(transaction.debit) || 0,
        credit: Number(transaction.credit) || 0,
        balance: Number(transaction.balance) || 0,
        category: transaction.category || 'その他',
        isValid: Boolean(transaction.isValid !== false) // Default to true unless explicitly false
      }));

      return {
        success: true,
        data: cleanedTransactions
      };

    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      return {
        success: false,
        error: 'AIの応答を解析できませんでした。PDFの形式が対応していない可能性があります。'
      };
    }

  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      success: false,
      error: 'AI処理中にエラーが発生しました。しばらく時間をおいて再試行してください。'
    };
  }
};

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Fallback function for demo purposes when API key is not available
export const processDemoData = async (file: File): Promise<ProcessingResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  const mockData: TransactionData[] = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'AMAZON.CO.JP でのお買い物',
      debit: 15420,
      credit: 0,
      balance: 524580,
      category: 'ショッピング',
      isValid: true
    },
    {
      id: '2',
      date: '2024-01-16',
      description: '給与振込',
      debit: 0,
      credit: 250000,
      balance: 774580,
      category: '給与',
      isValid: true
    },
    {
      id: '3',
      date: '2024-01-17',
      description: 'コンビニエンスストア',
      debit: 890,
      credit: 0,
      balance: 773690,
      category: '食費',
      isValid: true
    },
    {
      id: '4',
      date: '2024-01-18',
      description: '電気料金',
      debit: 8500,
      credit: 0,
      balance: 765190,
      category: '光熱費',
      isValid: true
    },
    {
      id: '5',
      date: '2024-01-19',
      description: 'ATM出金',
      debit: 20000,
      credit: 0,
      balance: 745190,
      category: '現金引出',
      isValid: true
    }
  ];

  return {
    success: true,
    data: mockData
  };
};