import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Edit2, Trash2, ArrowRight } from 'lucide-react';
import type { Collection, HistoryItem } from '../../types';

interface CollectionItemProps {
  collection: Collection;
  onSelect: (item: HistoryItem) => void;
  onEdit: () => void;
  onDelete: () => void;
  onRemoveRequest: (requestId: string) => void;
}

export function CollectionItem({
  collection,
  onSelect,
  onEdit,
  onDelete,
  onRemoveRequest,
}: CollectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this collection?')) {
      onDelete();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
          <div>
            <h4 className="font-medium">{collection.name}</h4>
            {collection.description && (
              <p className="text-sm text-gray-500">{collection.description}</p>
            )}
          </div>
          <span className="text-sm text-gray-500 ml-2">({collection.requests.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t divide-y">
          {collection.requests.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              No requests in this collection
            </div>
          ) : (
            collection.requests.map((item) => (
              <div
                key={`${item.request.id}-${item.request.timestamp}`}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`shrink-0 px-2 py-0.5 text-xs rounded ${
                      item.response
                        ? item.response.status >= 200 && item.response.status < 300
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.request.method}
                    </span>
                    <span className="text-sm font-mono truncate">
                      {item.request.url}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveRequest(item.request.id);
                      }}
                      className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(item);
                      }}
                      className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}