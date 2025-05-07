// @ts-nocheck
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MouseEvent } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

const HeroSection = () => {
  const { showLoadingForDuration } = useLoading();

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      showLoadingForDuration(undefined, href);
    }
  };
  
  return (
    <section id="home" className="py-20 md:py-32 text-center">
      <div className="container mx-auto px-4">
        <h1
          className="text-4xl md:text-6xl font-bold mb-4 animate-slideUpFadeIn opacity-0"
          style={{ animationFillMode: 'forwards' }}
        >
          Hello, I&apos;m <span className="text-primary">Jagan Mohan Reddy Kontham</span>
        </h1>
        <p
          className="text-2xl md:text-3xl text-accent mb-8 animate-slideUpFadeIn opacity-0 animation-delay-200"
          style={{ animationFillMode: 'forwards' }}
        >
          Full-Stack Developer
        </p>
        <p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slideUpFadeIn opacity-0 animation-delay-400"
          style={{ animationFillMode: 'forwards' }}
        >
          Passionate about crafting innovative and user-friendly web applications. Explore my journey, skills, and projects in the world of web development.
        </p>
        <div
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slideUpFadeIn opacity-0 animation-delay-600"
          style={{ animationFillMode: 'forwards' }}
        >
          <Button size="lg" asChild className={cn("group", "interactive-border")}>
            <Link href="#projects" onClick={(e) => handleNavClick(e, '#projects')}>
              View Projects
              <Briefcase className="ml-2 h-5 w-5 group-hover:animate-pulse" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className={cn("group", "interactive-border")}>
            <Link href="#introduction" onClick={(e) => handleNavClick(e, '#introduction')}>
              About Me
              <UserCircle className="ml-2 h-5 w-5 group-hover:animate-pulse" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
