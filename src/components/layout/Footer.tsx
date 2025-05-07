import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 py-8">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="mailto:konthamjaganmohanredy@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email" className={cn('p-2 rounded-md interactive-border border-2 border-transparent')}>
            <Mail className="h-6 w-6 hover:text-accent transition-colors" />
          </Link>
          <Link href="https://github.com/11Jagan" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={cn('p-2 rounded-md interactive-border border-2 border-transparent')}>
            <Github className="h-6 w-6 hover:text-accent transition-colors" />
          </Link>
          <Link href="https://linkedin.com/in/jagan-mohan-reddy-kontham-445250293/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={cn('p-2 rounded-md interactive-border border-2 border-transparent')}>
            <Linkedin className="h-6 w-6 hover:text-accent transition-colors" />
          </Link>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} JMR. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Built with Next.js and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
