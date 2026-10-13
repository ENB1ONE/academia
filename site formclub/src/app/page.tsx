import HeroSection from '@/components/sections/HeroSection';
import ManifestoComparison from '@/components/sections/ManifestoComparison';
import ModalitiesGrid from '@/components/sections/ModalitiesGrid';
import AmenitiesBento from '@/components/sections/AmenitiesBento';
import WellhubSection from '@/components/sections/WellhubSection';
import ReviewsCarousel from '@/components/sections/ReviewsCarousel';
import PlansSection from '@/components/sections/PlansSection';
import LocationAndFaq from '@/components/sections/LocationAndFaq';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <ManifestoComparison />
      <ModalitiesGrid />
      <AmenitiesBento />
      <WellhubSection />
      <ReviewsCarousel />
      <PlansSection />
      <LocationAndFaq />
    </div>
  );
}
