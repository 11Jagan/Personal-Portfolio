
'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>; // Kept for flexibility, though showLoadingForDuration is primary
  showLoadingForDuration: (duration: number, hash?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [targetHash, setTargetHash] = useState<string | undefined>(undefined);

  const showLoadingForDuration = (duration: number, hash?: string) => {
    setIsLoading(true);
    if (hash) {
      setTargetHash(hash);
    }
    // If it's a full page navigation (e.g. hash is '/'), don't set a timeout for manual isLoading=false,
    // let Next.js routing and its own loading.tsx handle it.
    // Only set timeout for in-page hash navigations.
    if (hash && hash.startsWith('#')) {
      setTimeout(() => {
        setIsLoading(false);
        // Scrolling will be handled by the useEffect below
      }, duration);
    } else if (!hash) { // For generic loading calls without a hash
        setTimeout(() => {
            setIsLoading(false);
        }, duration);
    }
    // If hash is something like '/', isLoading becomes true, and Next.js routing will eventually
    // complete and its loading.tsx will disappear, at which point isLoading should ideally be reset
    // if it wasn't already by a timeout. This needs careful handling if used for full page loads.
    // For now, this context is primarily for in-page hash scrolling.
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
