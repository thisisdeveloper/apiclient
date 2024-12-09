import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/idGenerator';
import type { Tab, TabsContextType, ApiRequest, ApiResponse } from '../types';

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const DEFAULT_TAB: Tab = {
  id: generateId(),
  title: 'New Request',
  request: {
    id: generateId(),
    method: 'GET',
    url: '',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: '',
    timestamp: Date.now(),
    params: [],
    auth: {
      type: 'none',
      config: {}
    }
  }
};

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useLocalStorage<Tab[]>('api-client-tabs', [DEFAULT_TAB]);
  const [activeTabId, setActiveTabId] = useLocalStorage<string>('api-client-active-tab', DEFAULT_TAB.id);

  useEffect(() => {
    if (tabs.length === 0) {
      const newTab = {
        ...DEFAULT_TAB,
        id: generateId(),
        request: { ...DEFAULT_TAB.request, id: generateId() }
      };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    }
  }, [tabs, setTabs, setActiveTabId]);

  const addTab = () => {
    const newTab: Tab = {
      id: generateId(),
      title: 'New Request',
      request: {
        ...DEFAULT_TAB.request,
        id: generateId(),
        timestamp: Date.now()
      }
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (id: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== id);
      if (newTabs.length === 0) {
        const newTab = {
          ...DEFAULT_TAB,
          id: generateId(),
          request: { ...DEFAULT_TAB.request, id: generateId() }
        };
        return [newTab];
      }
      return newTabs;
    });

    setActiveTabId(prev => {
      if (prev === id) {
        const index = tabs.findIndex(tab => tab.id === id);
        const newIndex = Math.max(0, index - 1);
        return tabs[newIndex]?.id || tabs[0].id;
      }
      return prev;
    });
  };

  const updateTabRequest = (id: string, request: ApiRequest) => {
    setTabs(prev => prev.map(tab => 
      tab.id === id 
        ? { ...tab, request }
        : tab
    ));
  };

  const updateTabResponse = (id: string, response: ApiResponse | undefined, error?: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === id 
        ? { ...tab, response, error }
        : tab
    ));
  };

  const renameTab = (id: string, newTitle: string) => {
    setTabs(prev => prev.map(tab =>
      tab.id === id
        ? { ...tab, title: newTitle }
        : tab
    ));
  };

  return (
    <TabsContext.Provider value={{
      tabs,
      activeTabId,
      addTab,
      closeTab,
      setActiveTab: setActiveTabId,
      updateTabRequest,
      updateTabResponse,
      renameTab,
    }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
}