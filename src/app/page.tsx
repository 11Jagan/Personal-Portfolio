import IntroductionSection from '@/components/sections/IntroductionSection';
import ProjectShowcaseSection from '@/components/sections/ProjectShowcaseSection';
import ContactSection from '@/components/sections/ContactSection';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-24">
      <IntroductionSection />
      <Separator />
      <ProjectShowcaseSection />
      <Separator />
      <ContactSection />
    </div>
  );
}
