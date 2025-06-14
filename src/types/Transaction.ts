export interface TransactionData {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  category?: string;
  isValid: boolean;
  notes?: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  severity: 'info' | 'warning' | 'error';
}

export interface ExportSettings {
  includeColumns: string[];
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
  includeCategories: boolean;
  excludeRows: string[];
}