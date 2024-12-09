import React, { useState, useRef, useEffect } from 'react';
import { FolderPlus, Check } from 'lucide-react';
import type { Collection, HistoryItem } from '../../types';
import { useCollections } from '../../hooks/useCollections';

interface CollectionSelectorProps {
  item: HistoryItem;
  onCollectionUpdate?: () => void;
}

export function CollectionSelector({ item, onCollectionUpdate }: CollectionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { collections, addToCollection } = useCollections();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddToCollection = async (collectionId: string) => {
    try {
      await addToCollection(collectionId, item);
      setIsOpen(false);
      onCollectionUpdate?.();
    } catch (error) {
      console.error('Failed to add to collection:', error);
    }
  };

  const isInCollection = (collection: Collection) => {
    return collection.requests.some(request => request.request.id === item.request.id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50"
        title="Add to Collection"
      >
        <FolderPlus className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {collections.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No collections available
            </div>
          ) : (
            collections.map(collection => {
              const added = isInCollection(collection);
              return (
                <button
                  key={collection.id}
                  onClick={() => !added && handleAddToCollection(collection.id)}
                  className={`w-full px-4 py-2 text-sm text-left flex items-center justify-between ${
                    added
                      ? 'text-green-600 bg-green-50 cursor-default'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{collection.name}</span>
                  {added && <Check className="h-4 w-4" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}