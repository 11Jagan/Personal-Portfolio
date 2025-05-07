import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Lightbulb, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const IntroductionSection = () => {
  const skills = ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Node.js', 'Express.js', 'MongoDB', 'React (Learning)', 'Python (Learning)'];

  return (
    <section id="introduction" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold text-primary animate-slideUpFadeIn opacity-0" 
            style={{ animationFillMode: 'forwards' }}
          >
            Meet Me
          </h2>
          <p 
            className="text-lg text-muted-foreground mt-2 animate-slideUpFadeIn opacity-0 animation-delay-200"
            style={{ animationFillMode: 'forwards' }}
          >
            A glimpse into my passion, skills, and journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
          {/* Left Panel: Profile Image, Name, Title, GitHub Button */}
          <div 
            className="md:col-span-1 flex flex-col items-center md:items-start space-y-6 animate-slideUpFadeIn opacity-0 animation-delay-400"
            style={{ animationFillMode: 'forwards' }}
          >
            <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden shadow-xl border-4 border-primary/30 hover:border-primary/50 transition-all duration-300 group">
              <Image
                src="/me.jpg"
                alt="Kontham Jagan Mohan Reddy"
                layout="fill"
                objectFit="cover"
                className="transform transition-transform duration-500 group-hover:scale-110"
                data-ai-hint="profile picture person"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Kontham Jagan Mohan Reddy</h1>
              <p className="text-lg lg:text-xl text-accent font-medium">Full-Stack Developer</p>
            </div>
            <Button 
              size="lg" 
              className={cn("w-full md:w-auto group interactive-border border-2 border-transparent text-sm md:text-base")} 
              asChild
            >
              <Link href="https://github.com/11Jagan" target="_blank" rel="noopener noreferrer">
                View GitHub Profile
                <Github className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Right Panel: About, Skills, Interests Cards */}
          <div className="md:col-span-2 space-y-8">
            <Card 
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideUpFadeIn opacity-0 animation-delay-600"
              style={{ animationFillMode: 'forwards' }}
            >
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-primary">My Journey &amp; Philosophy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base md:text-lg text-foreground/85">
                <p>
                  Hello! I&apos;m Jagan, a dedicated Full-Stack Developer passionate about crafting dynamic and user-centric web applications.
                  My journey in tech is driven by a love for solving complex challenges and a commitment to continuous learning.
                </p>
                <p>
                  I believe in creating software that not only functions flawlessly but also provides an intuitive and enjoyable user experience. This philosophy guides my approach to every project I undertake.
                </p>
              </CardContent>
            </Card>

            <Card 
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideUpFadeIn opacity-0" 
              style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
            >
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-primary flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Core Skillset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="text-sm py-1.5 px-3 rounded-md shadow-sm hover:bg-primary/10 transition-colors cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideUpFadeIn opacity-0"
              style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
            >
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-primary flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Always Evolving
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base md:text-lg text-foreground/85">
                <p>
                  The tech landscape is ever-changing, and I embrace the opportunity to continuously expand my horizons. Currently, I&apos;m deepening my expertise in{' '}
                  <span className="font-semibold text-accent">React</span> and{' '}
                  <span className="font-semibold text-accent">Python</span>, alongside exploring emerging technologies and contributing to vibrant tech communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
