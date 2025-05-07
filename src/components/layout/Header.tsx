
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CodeXml } from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';
import { useLoading } from '@/contexts/LoadingContext';
import type { MouseEvent } from 'react';

const Header = () => {
  const { showLoadingForDuration } = useLoading();

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      // For in-page hash links, show the loading screen.
      // The Link component will update the URL hash.
      // Scrolling is handled by the LoadingContext after the delay.
      showLoadingForDuration(1000, href); // Decreased duration to 1000ms
    }
    // For other links (e.g., '/'), allow default Next.js Link behavior and its own loading.tsx.
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 group">
          {/* No custom onClick for home link, relies on Next.js page loading */}
          <CodeXml className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
          <span className="font-bold sm:inline-block text-lg group-hover:text-accent transition-colors">
            JMR
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-1 sm:justify-end">
          <Button variant="ghost" asChild className="interactive-border">
            <Link href="#introduction" onClick={(e) => handleNavClick(e, '#introduction')}>About</Link>
          </Button>
          <Button variant="ghost" asChild className="interactive-border">
            <Link href="#projects" onClick={(e) => handleNavClick(e, '#projects')}>Projects</Link>
          </Button>
          <Button variant="ghost" asChild className="interactive-border">
            <Link href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
