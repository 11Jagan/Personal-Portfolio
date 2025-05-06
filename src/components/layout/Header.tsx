import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CodeXml } from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <CodeXml className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            Persona Canvas
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-2 sm:justify-end">
          <Button variant="ghost" asChild>
            <Link href="#introduction">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#projects">Projects</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#contact">Contact</Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
