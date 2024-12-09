import React from 'react';

interface JsonTableProps {
  data: any;
}

export function JsonTable({ data }: JsonTableProps) {
  if (!data || typeof data !== 'object') {
    return <div className="p-3 text-gray-500">Cannot display data as table</div>;
  }

  // Handle array of objects
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <div className="p-3 text-gray-500">Empty array</div>;
    }

    const columns = Array.from(
      new Set(
        data.flatMap(item => 
          typeof item === 'object' && item !== null 
            ? Object.keys(item) 
            : []
        )
      )
    );

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map(column => (
                  <td key={column} className="px-3 py-2 text-sm text-gray-500 font-mono">
                    {typeof item === 'object' && item !== null
                      ? JSON.stringify(item[column])
                      : String(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Handle single object
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Key
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td className="px-3 py-2 text-sm font-medium text-gray-900 font-mono">
                {key}
              </td>
              <td className="px-3 py-2 text-sm text-gray-500 font-mono">
                {typeof value === 'object'
                  ? JSON.stringify(value)
                  : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}