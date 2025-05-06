import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 py-8">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="mailto:konthamjaganmohanredy@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
            <Mail className="h-6 w-6 hover:text-primary transition-colors" />
          </Link>
          <Link href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-6 w-6 hover:text-primary transition-colors" />
          </Link>
          <Link href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-6 w-6 hover:text-primary transition-colors" />
          </Link>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Persona Canvas. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Built with Next.js and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
