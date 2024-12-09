import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import type { Collection, HistoryItem } from '../../types';
import { CollectionItem } from './CollectionItem';

interface CollectionListProps {
  collections: Collection[];
  onSelect: (item: HistoryItem) => void;
  onAddCollection: () => void;
  onEditCollection: (collection: Collection) => void;
  onDeleteCollection: (id: string) => void;
  onAddToCollection: (collectionId: string, item: HistoryItem) => void;
  onRemoveFromCollection: (collectionId: string, requestId: string) => void;
  forceUpdate?: number;
}

export function CollectionList({
  collections,
  onSelect,
  onAddCollection,
  onEditCollection,
  onDeleteCollection,
  onAddToCollection,
  onRemoveFromCollection,
  forceUpdate,
}: CollectionListProps) {
  if (collections.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FolderOpen className="mx-auto mb-2 opacity-50 h-10 w-10" />
        <p>No collections yet</p>
        <button
          onClick={onAddCollection}
          className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Collection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Collections</h3>
        <button
          onClick={onAddCollection}
          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
          title="Add Collection"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {collections.map((collection) => (
          <CollectionItem
            key={`${collection.id}-${forceUpdate}`}
            collection={collection}
            onSelect={onSelect}
            onEdit={() => onEditCollection(collection)}
            onDelete={() => onDeleteCollection(collection.id)}
            onRemoveRequest={(requestId) => onRemoveFromCollection(collection.id, requestId)}
          />
        ))}
      </div>
    </div>
  );
}