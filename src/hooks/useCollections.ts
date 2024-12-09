import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Collection, HistoryItem } from '../types';
import { generateId } from '../utils/idGenerator';
import { areRequestsEqual } from '../utils/requestUtils';

export function useCollections() {
  const [collections, setCollections] = useLocalStorage<Collection[]>('api-client-collections', []);

  const addCollection = useCallback(async (data: Partial<Collection>) => {
    const newCollection: Collection = {
      id: generateId(),
      name: data.name || 'New Collection',
      description: data.description,
      requests: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCollections(prev => [...prev, newCollection]);
    return newCollection.id;
  }, [setCollections]);

  const updateCollection = useCallback(async (id: string, data: Partial<Collection>) => {
    setCollections(prev =>
      prev.map(collection =>
        collection.id === id
          ? {
              ...collection,
              ...data,
              updatedAt: Date.now(),
            }
          : collection
      )
    );
  }, [setCollections]);

  const deleteCollection = useCallback(async (id: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== id));
  }, [setCollections]);

  const addToCollection = useCallback(async (collectionId: string, item: HistoryItem) => {
    setCollections(prev =>
      prev.map(collection => {
        if (collection.id !== collectionId) return collection;

        const exists = collection.requests.some(existing => 
          areRequestsEqual(existing.request, item.request)
        );

        if (exists) return collection;

        return {
          ...collection,
          requests: [item, ...collection.requests],
          updatedAt: Date.now(),
        };
      })
    );
  }, [setCollections]);

  const removeFromCollection = useCallback(async (collectionId: string, requestId: string) => {
    setCollections(prev =>
      prev.map(collection =>
        collection.id === collectionId
          ? {
              ...collection,
              requests: collection.requests.filter(item => item.request.id !== requestId),
              updatedAt: Date.now(),
            }
          : collection
      )
    );
  }, [setCollections]);

  const isInCollection = useCallback((collectionId: string, requestId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    return collection?.requests.some(item => item.request.id === requestId) || false;
  }, [collections]);

  return {
    collections,
    addCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    isInCollection,
  };
}