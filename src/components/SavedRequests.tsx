import React from 'react';
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react';
import type { HistoryItem } from '../types';
import { CollectionSelector } from './collections/CollectionSelector';

interface SavedRequestsProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
  onCollectionUpdate?: () => void;
}

export function SavedRequests({ items, onSelect, onRemove, onCollectionUpdate }: SavedRequestsProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Bookmark className="mx-auto mb-2 opacity-50 h-10 w-10" />
        <p>No saved requests yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isSuccess = item.response && item.response.status >= 200 && item.response.status < 300;

        return (
          <div
            key={`saved-${item.request.id}-${item.request.timestamp}`}
            className="group relative p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`shrink-0 px-2 py-0.5 text-xs rounded ${
                  item.response
                    ? isSuccess
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.request.method}
                </span>
                <span className="text-sm font-mono truncate flex-1">
                  {item.request.url}
                </span>
                <div className="flex items-center gap-2">
                  <CollectionSelector
                    item={item}
                    onCollectionUpdate={onCollectionUpdate}
                  />
                  <button
                    type="button"
                    onClick={() => onRemove(item.request.id)}
                    className="p-1 rounded-md text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(item.request.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}