import React, { useState } from 'react';
import { Check, X, Table, Code } from 'lucide-react';
import { ResizablePanel } from './ResizablePanel';
import { JsonTable } from './JsonTable';
import type { ApiResponse } from '../types';

interface ResponseViewProps {
  response: ApiResponse | null;
  error?: string;
}

export function ResponseView({ response, error }: ResponseViewProps) {
  const [viewMode, setViewMode] = useState<'json' | 'table'>('json');
  
  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <X className="h-5 w-5" />
          <h3 className="text-lg font-medium">Error</h3>
        </div>
        <div className="flex-1 bg-red-50 p-4 rounded-lg border border-red-200 overflow-auto">
          <pre className="whitespace-pre-wrap text-red-700">{error}</pre>
        </div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  const isSuccess = response.status >= 200 && response.status < 300;
  const canShowTable = typeof response.data === 'object' && response.data !== null;

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className={`p-4 ${isSuccess ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg border ${isSuccess ? 'border-green-200' : 'border-yellow-200'} mb-4 flex-none`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-yellow-600" />
            )}
            <h3 className={`text-lg font-medium ${isSuccess ? 'text-green-600' : 'text-yellow-600'}`}>
              {response.status} {response.statusText}
            </h3>
          </div>
          
          {canShowTable && (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('json')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'json'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title="View as JSON"
              >
                <Code className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'table'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title="View as Table"
              >
                <Table className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
        <div className="flex-none">
          <h4 className="font-medium mb-2">Response Headers</h4>
          <div className="bg-white p-3 rounded border overflow-auto max-h-40">
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="grid grid-cols-3 gap-2">
                <span className="font-mono text-gray-600">{key}:</span>
                <span className="col-span-2 font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <h4 className="font-medium mb-2">Response Body</h4>
          <div className="flex-1 min-h-0 bg-white rounded border overflow-auto">
            {viewMode === 'table' && canShowTable ? (
              <JsonTable data={response.data} />
            ) : (
              <pre className="p-3 font-mono text-sm h-full">
                {typeof response.data === 'string'
                  ? response.data
                  : JSON.stringify(response.data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}