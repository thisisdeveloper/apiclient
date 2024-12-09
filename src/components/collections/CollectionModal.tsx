import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Collection } from '../../types';

interface CollectionModalProps {
  collection?: Collection;
  onSave: (collection: Partial<Collection>) => void;
  onClose: () => void;
}

export function CollectionModal({ collection, onSave, onClose }: CollectionModalProps) {
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {collection ? 'Edit Collection' : 'New Collection'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Collection Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              placeholder="Enter collection name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
              placeholder="Enter collection description (optional)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-colors"
            >
              {collection ? 'Save Changes' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}