import React, { useState } from 'react';
import { Loader2, AlertTriangle, CheckCircle, Edit3, Save, X } from 'lucide-react';
import { TransactionData } from '../types/Transaction';
import { BalanceValidator } from './BalanceValidator';

interface DataTableProps {
  data: TransactionData[];
  isProcessing: boolean;
  onDataUpdate: (data: TransactionData[]) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ data, isProcessing, onDataUpdate }) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleEdit = (id: string, field: string, currentValue: any) => {
    setEditingCell({ id, field });
    setEditValue(String(currentValue));
  };

  const handleSave = () => {
    if (!editingCell) return;

    const updatedData = data.map(row => {
      if (row.id === editingCell.id) {
        const updatedRow = { ...row };
        
        if (editingCell.field === 'debit' || editingCell.field === 'credit' || editingCell.field === 'balance') {
          updatedRow[editingCell.field as keyof TransactionData] = parseFloat(editValue) || 0;
        } else {
          (updatedRow as any)[editingCell.field] = editValue;
        }
        
        return updatedRow;
      }
      return row;
    });

    onDataUpdate(updatedData);
    setEditingCell(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            AI Processing Your Statement
          </h4>
          <p className="text-gray-600">
            Our AI is extracting and structuring your transaction data...
          </p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No transaction data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <BalanceValidator data={data} />
      
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Debit
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr 
                key={row.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  !row.isValid ? 'bg-red-50 border-l-4 border-red-400' : ''
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {editingCell?.id === row.id && editingCell?.field === 'date' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="date"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                        autoFocus
                      />
                      <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center space-x-2 group cursor-pointer"
                      onClick={() => handleEdit(row.id, 'date', row.date)}
                    >
                      <span>{row.date}</span>
                      <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {editingCell?.id === row.id && editingCell?.field === 'description' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                        autoFocus
                      />
                      <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="group cursor-pointer flex items-center space-x-2"
                      onClick={() => handleEdit(row.id, 'description', row.description)}
                    >
                      <span className="truncate max-w-xs">{row.description}</span>
                      <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  {editingCell?.id === row.id && editingCell?.field === 'debit' ? (
                    <div className="flex items-center justify-end space-x-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-20 text-right"
                        autoFocus
                      />
                      <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="group cursor-pointer flex items-center justify-end space-x-2"
                      onClick={() => handleEdit(row.id, 'debit', row.debit)}
                    >
                      <span className={row.debit > 0 ? 'text-red-600 font-medium' : 'text-gray-400'}>
                        {row.debit > 0 ? formatCurrency(row.debit) : '—'}
                      </span>
                      <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  {editingCell?.id === row.id && editingCell?.field === 'credit' ? (
                    <div className="flex items-center justify-end space-x-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-20 text-right"
                        autoFocus
                      />
                      <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="group cursor-pointer flex items-center justify-end space-x-2"
                      onClick={() => handleEdit(row.id, 'credit', row.credit)}
                    >
                      <span className={row.credit > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                        {row.credit > 0 ? formatCurrency(row.credit) : '—'}
                      </span>
                      <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  {editingCell?.id === row.id && editingCell?.field === 'balance' ? (
                    <div className="flex items-center justify-end space-x-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-24 text-right"
                        autoFocus
                      />
                      <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="group cursor-pointer flex items-center justify-end space-x-2"
                      onClick={() => handleEdit(row.id, 'balance', row.balance)}
                    >
                      <span className="text-gray-900 font-medium">
                        {formatCurrency(row.balance)}
                      </span>
                      <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {editingCell?.id === row.id && editingCell?.field === 'category' ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        autoFocus
                      >
                        <option value="">Select category</option>
                        <option value="Income">Income</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Bills & Utilities">Bills & Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                      </select>
                      <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="group cursor-pointer flex items-center space-x-2"
                      onClick={() => handleEdit(row.id, 'category', row.category || '')}
                    >
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {row.category || 'Uncategorized'}
                      </span>
                      <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};