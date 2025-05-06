import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Briefcase, Lightbulb, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IntroductionSection = () => {
  const skills = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Firebase', 'GraphQL', 'Docker'];

  return (
    <section id="introduction" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 rounded-full overflow-hidden shadow-lg border-4 border-primary/20">
              <Image
                src="https://picsum.photos/256/256"
                alt="Your Name"
                data-ai-hint="profile picture"
                layout="fill"
                objectFit="cover"
                className="transform transition-transform duration-500 hover:scale-105"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left mb-2">John Doe</h1>
            <p className="text-xl text-muted-foreground text-center md:text-left mb-4">Full-Stack Developer & UI/UX Enthusiast</p>
            <Button className="w-full md:w-auto group" >
              Download CV
              <Download className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="md:col-span-2">
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">About Me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-lg text-foreground/80">
                <p>
                  Hello! I&apos;m John, a passionate Full-Stack Developer with 3+ years of experience in building dynamic and user-friendly web applications.
                  I thrive on solving complex problems and continuously learning new technologies. My goal is to create software that not only functions flawlessly but also provides an exceptional user experience.
                </p>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-secondary-foreground flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                    Core Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm py-1 px-3 rounded-full shadow-sm hover:bg-primary/10 transition-colors">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-secondary-foreground flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    Experience Highlights
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Lead Developer at Tech Solutions Inc. (2021 - Present)</li>
                    <li>Software Engineer at Innovate Co. (2019 - 2021)</li>
                  </ul>
                </div>
                 <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-secondary-foreground flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Interests
                  </h3>
                  <p>
                    Beyond coding, I enjoy hiking, photography, and exploring new coffee shops. I'm also an avid contributor to open-source projects.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
