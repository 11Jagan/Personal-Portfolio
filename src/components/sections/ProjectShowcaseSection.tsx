import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  tags: string[];
  liveDemoUrl?: string;
  repoUrl?: string;
}

const projects: Project[] = [
  {
    id: 'project-1',
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with user authentication, product listings, cart functionality, and payment integration. Built with Next.js, Stripe, and Firebase.',
    imageUrl: 'https://picsum.photos/600/400?random=1',
    imageHint: 'online store',
    tags: ['Next.js', 'Stripe', 'Firebase', 'Tailwind CSS'],
    liveDemoUrl: '#',
    repoUrl: 'https://github.com/11Jagan',
  },
  {
    id: 'project-2',
    title: 'Task Management App',
    description: 'A collaborative task management application that helps teams organize and track their work. Features include drag-and-drop boards, real-time updates, and notifications.',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    imageHint: 'to do list',
    tags: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    liveDemoUrl: '#',
    // No repoUrl for this project, so GitHub button won't render as per current logic.
    // If one is desired, it can be added: repoUrl: 'https://github.com/11Jagan',
  },
  {
    id: 'project-3',
    title: 'Portfolio Website Builder',
    description: 'A dynamic portfolio website builder allowing users to create and customize their personal showcase. Leveraged Next.js for SSR and Vercel for deployment.',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    imageHint: 'website builder',
    tags: ['Next.js', 'TypeScript', 'Vercel'],
    repoUrl: 'https://github.com/11Jagan',
  },
];

const ProjectShowcaseSection = () => {
  return (
    <section id="projects" className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">My Projects</h2>
        <p className="text-lg text-muted-foreground text-center mb-12">
          Here are some of the key projects I&apos;ve worked on.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col overflow-hidden shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 group rotate-border">
              <div className="relative w-full h-56">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  data-ai-hint={project.imageHint}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-sm text-foreground/80">{project.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-end space-x-3 pt-4">
                {project.repoUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> GitHub
                    </a>
                  </Button>
                )}
                {project.liveDemoUrl && (
                  <Button variant="default" size="sm" asChild className=" hover:bg-primary/90">
                    <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcaseSection;

