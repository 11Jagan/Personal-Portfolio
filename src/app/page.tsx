import HeroSection from '@/components/sections/HeroSection';
import IntroductionSection from '@/components/sections/IntroductionSection';
import ProjectShowcaseSection from '@/components/sections/ProjectShowcaseSection';
import ContactSection from '@/components/sections/ContactSection';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="space-y-12 md:space-y-20"> {/* Reduced spacing slightly to accommodate more sections */}
      <HeroSection />
      {/* No Separator needed if HeroSection is visually distinct enough, or add if desired */}
      <IntroductionSection />
      <Separator />
      <ProjectShowcaseSection />
      <Separator />
      <ContactSection />
    </div>
  );
}
