
'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>; // Kept for flexibility, though showLoadingForDuration is primary
  showLoadingForDuration: (duration?: number, hash?: string) => void; // Duration is now optional
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

const DEFAULT_LOADING_DURATION = 2500; // Default duration set to 2500ms

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [targetHash, setTargetHash] = useState<string | undefined>(undefined);

  const showLoadingForDuration = (duration: number = DEFAULT_LOADING_DURATION, hash?: string) => {
    setIsLoading(true);
    if (hash) {
      setTargetHash(hash);
    }
    
    // Use the provided duration or the default
    const currentDuration = duration;

    // Only set timeout for in-page hash navigations or generic loading calls.
    if ((hash && hash.startsWith('#')) || !hash) {
      setTimeout(() => {
        setIsLoading(false);
        // Scrolling will be handled by the useEffect below
      }, currentDuration);
    }
    // If hash is something like '/', isLoading becomes true, and Next.js routing will eventually
    // complete and its loading.tsx will disappear.
  };

  useEffect(() => {
    if (!isLoading && targetHash && targetHash.startsWith('#')) {
      const elementId = targetHash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setTargetHash(undefined); // Clear the hash after scrolling
    }
  }, [isLoading, targetHash]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, showLoadingForDuration }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

