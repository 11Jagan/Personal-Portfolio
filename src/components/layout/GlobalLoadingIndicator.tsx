
'use client';

import { useLoading } from '@/contexts/LoadingContext';
import LoadingScreen from '@/app/loading'; // Using the existing loading screen UI

const GlobalLoadingIndicator = () => {
  const { isLoading } = useLoading();

  // Only render the loading screen if isLoading is true.
  // This component is specifically for the context-driven loader,
  // not replacing Next.js's built-in loading.tsx for page transitions.
  if (!isLoading) {
    return null;
  }

  return <LoadingScreen />;
};

export default GlobalLoadingIndicator;
