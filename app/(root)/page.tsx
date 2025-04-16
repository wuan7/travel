import ExploreDestinations from "../../components/ExploreDestinations";
import ExploreTours from "../../components/ExploreTours";
import HeroSection from "../../components/HeroSection";
import InspiringReads from "../../components/InspiringReads";
import TravelDestinations from "../../components/TravelDestinations";
export default function Home() {
  return (
    <div className="p-3 md:p-0 overflow-x-hidden">
      <HeroSection />
      <div className="max-w-6xl mx-auto">
      <TravelDestinations />
      <ExploreDestinations />
      <ExploreTours />
      <InspiringReads />
      </div>
    </div>
  );
}
