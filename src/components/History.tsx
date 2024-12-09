import React, { useState, useCallback, useEffect } from 'react';
import { Clock, Bookmark, FolderOpen } from 'lucide-react';
import type { HistoryItem, Collection } from '../types';
import { Tab } from './Tab';
import { SavedRequests } from './SavedRequests';
import { HistoryItemComponent } from './HistoryItem';
import { CollectionList } from './collections/CollectionList';
import { CollectionModal } from './collections/CollectionModal';
import { useCollections } from '../hooks/useCollections';

interface HistoryProps {
  items: HistoryItem[];
  savedRequests: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onSave: (item: HistoryItem) => void;
  onRemoveSaved: (id: string) => void;
  onClear: () => void;
}

type TabType = 'history' | 'saved' | 'collections';

export function History({
  items,
  savedRequests,
  onSelect,
  onSave,
  onRemoveSaved,
  onClear
}: HistoryProps) {
  const [activeTab, setActiveTab] = useState<TabType>('history');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection>();
  const [forceUpdate, setForceUpdate] = useState(0);

  const {
    collections,
    addCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
  } = useCollections();

  const handleCollectionUpdate = useCallback(() => {
    setForceUpdate(prev => prev + 1);
  }, []);

  // Force update collections when tab changes
  useEffect(() => {
    if (activeTab === 'collections') {
      handleCollectionUpdate();
    }
  }, [activeTab]);

  const handleAddCollection = () => {
    setEditingCollection(undefined);
    setIsModalOpen(true);
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const handleSaveCollection = async (data: Partial<Collection>) => {
    try {
      if (editingCollection) {
        await updateCollection(editingCollection.id, data);
      } else {
        await addCollection(data);
      }
      setIsModalOpen(false);
      handleCollectionUpdate();
    } catch (error) {
      console.error('Failed to save collection:', error);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      await deleteCollection(id);
      handleCollectionUpdate();
    } catch (error) {
      console.error('Failed to delete collection:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        if (items.length === 0) {
          return (
            <div className="text-center py-8 text-gray-500">
              <Clock className="mx-auto mb-2 opacity-50 h-10 w-10" />
              <p>No request history yet</p>
            </div>
          );
        }
        return (
          <div className="space-y-2">
            {items.map((item) => (
              <HistoryItemComponent
                key={`${item.request.id}-${item.request.timestamp}`}
                item={item}
                onSelect={onSelect}
                onSave={onSave}
                onCollectionUpdate={handleCollectionUpdate}
                isSaved={savedRequests.some(saved => saved.request.id === item.request.id)}
              />
            ))}
          </div>
        );

      case 'saved':
        return (
          <SavedRequests
            items={savedRequests}
            onSelect={onSelect}
            onRemove={onRemoveSaved}
            onCollectionUpdate={handleCollectionUpdate}
          />
        );

      case 'collections':
        return (
          <CollectionList
            collections={collections}
            onSelect={onSelect}
            onAddCollection={handleAddCollection}
            onEditCollection={handleEditCollection}
            onDeleteCollection={handleDeleteCollection}
            onAddToCollection={addToCollection}
            onRemoveFromCollection={removeFromCollection}
            forceUpdate={forceUpdate}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2">
        <div className="flex gap-2">
          <Tab
            label="History"
            isActive={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          />
          <Tab
            label="Saved"
            isActive={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
          />
          <Tab
            label="Collections"
            isActive={activeTab === 'collections'}
            onClick={() => setActiveTab('collections')}
          />
        </div>
        {activeTab === 'history' && items.length > 0 && (
          <button
            onClick={onClear}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 rounded-md hover:bg-red-50"
          >
            Clear History
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1 -mx-6 px-6">
        {renderContent()}
      </div>

      {isModalOpen && (
        <CollectionModal
          collection={editingCollection}
          onSave={handleSaveCollection}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}