import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { TransactionData } from '../types/Transaction';

interface BalanceValidatorProps {
  data: TransactionData[];
}

export const BalanceValidator: React.FC<BalanceValidatorProps> = ({ data }) => {
  const validation = useMemo(() => {
    if (data.length === 0) return null;

    const firstRow = data[0];
    const lastRow = data[data.length - 1];
    
    // Calculate expected balance
    let expectedBalance = firstRow.balance - firstRow.debit + firstRow.credit;
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      expectedBalance = expectedBalance - row.debit + row.credit;
    }
    
    const actualFinalBalance = lastRow.balance;
    const isValid = Math.abs(expectedBalance - actualFinalBalance) < 1; // Allow for rounding errors
    
    return {
      isValid,
      expectedBalance,
      actualBalance: actualFinalBalance,
      difference: Math.abs(expectedBalance - actualFinalBalance),
      totalTransactions: data.length,
      totalDebits: data.reduce((sum, row) => sum + row.debit, 0),
      totalCredits: data.reduce((sum, row) => sum + row.credit, 0)
    };
  }, [data]);

  if (!validation) return null;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="border-b border-gray-200 p-4 bg-gray-50">
      <div className="flex items-start space-x-3">
        {validation.isValid ? (
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-4 mb-2">
            <h4 className={`font-medium ${
              validation.isValid ? 'text-green-800' : 'text-red-800'
            }`}>
              Balance Validation
            </h4>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{validation.totalTransactions} transactions</span>
              <span>Total Debits: {formatCurrency(validation.totalDebits)}</span>
              <span>Total Credits: {formatCurrency(validation.totalCredits)}</span>
            </div>
          </div>
          
          {validation.isValid ? (
            <p className="text-sm text-green-700">
              ✓ All balances are correctly calculated and validated
            </p>
          ) : (
            <div className="text-sm text-red-700">
              <p className="font-medium">Balance mismatch detected!</p>
              <p>
                Expected final balance: {formatCurrency(validation.expectedBalance)} | 
                Actual final balance: {formatCurrency(validation.actualBalance)} | 
                Difference: {formatCurrency(validation.difference)}
              </p>
              <p className="text-xs mt-1">
                Please review the transaction amounts and balances for accuracy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};