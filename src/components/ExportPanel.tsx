import React, { useState } from 'react';
import { Download, Settings, Filter, FileText } from 'lucide-react';
import { TransactionData } from '../types/Transaction';

interface ExportPanelProps {
  data: TransactionData[];
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ data }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [exportSettings, setExportSettings] = useState({
    includeColumns: ['date', 'description', 'debit', 'credit', 'balance', 'category'],
    dateFormat: 'YYYY-MM-DD' as const,
    includeCategories: true,
    excludeInvalidRows: false
  });

  const availableColumns = [
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'debit', label: 'Debit Amount' },
    { key: 'credit', label: 'Credit Amount' },
    { key: 'balance', label: 'Balance' },
    { key: 'category', label: 'Category' }
  ];

  const handleColumnToggle = (columnKey: string) => {
    setExportSettings(prev => ({
      ...prev,
      includeColumns: prev.includeColumns.includes(columnKey)
        ? prev.includeColumns.filter(col => col !== columnKey)
        : [...prev.includeColumns, columnKey]
    }));
  };

  const formatCurrency = (amount: number): string => {
    return amount.toFixed(2);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    switch (exportSettings.dateFormat) {
      case 'MM/DD/YYYY':
        return date.toLocaleDateString('en-US');
      case 'DD/MM/YYYY':
        return date.toLocaleDateString('en-GB');
      default:
        return dateString;
    }
  };

  const exportToCSV = () => {
    const filteredData = exportSettings.excludeInvalidRows 
      ? data.filter(row => row.isValid)
      : data;

    const headers = exportSettings.includeColumns.map(col => 
      availableColumns.find(c => c.key === col)?.label || col
    );

    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        exportSettings.includeColumns.map(col => {
          let value = '';
          switch (col) {
            case 'date':
              value = formatDate(row.date);
              break;
            case 'description':
              value = `"${row.description.replace(/"/g, '""')}"`;
              break;
            case 'debit':
              value = formatCurrency(row.debit);
              break;
            case 'credit':
              value = formatCurrency(row.credit);
              break;
            case 'balance':
              value = formatCurrency(row.balance);
              break;
            case 'category':
              value = row.category || '';
              break;
            default:
              value = '';
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bank_statement_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validRows = data.filter(row => row.isValid).length;
  const invalidRows = data.length - validRows;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
            <p className="text-sm text-gray-500">
              {data.length} total transactions • {validRows} valid • {invalidRows} need review
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg 
                         transition-all duration-200 ${
                showSettings 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 
                         text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 
                         transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>
      
      {showSettings && (
        <div className="border-b border-gray-200 p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Include Columns
              </h4>
              <div className="space-y-2">
                {availableColumns.map(column => (
                  <label key={column.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportSettings.includeColumns.includes(column.key)}
                      onChange={() => handleColumnToggle(column.key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">{column.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Options</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <select
                    value={exportSettings.dateFormat}
                    onChange={(e) => setExportSettings(prev => ({
                      ...prev,
                      dateFormat: e.target.value as any
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  </select>
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportSettings.excludeInvalidRows}
                    onChange={(e) => setExportSettings(prev => ({
                      ...prev,
                      excludeInvalidRows: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    Exclude invalid rows from export
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>CSV format with headers</span>
            </div>
            <span>•</span>
            <span>UTF-8 encoding</span>
          </div>
          
          <div className="text-right">
            <p>Ready to export {exportSettings.excludeInvalidRows ? validRows : data.length} rows</p>
          </div>
        </div>
      </div>
    </div>
  );
};