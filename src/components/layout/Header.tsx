import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CodeXml } from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 group">
          <CodeXml className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
          <span className="font-bold sm:inline-block text-lg group-hover:text-accent transition-colors">
            JMR
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-1 sm:justify-end">
          <Button variant="ghost" asChild className="interactive-border">
            <Link href="#introduction">About</Link>
          </Button>
          <Button variant="ghost" asChild className="interactive-border">
            <Link href="#projects">Projects</Link>
          </Button>
          <Button variant="ghost" asChild className="interactive-border">
            <Link href="#contact">Contact</Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
