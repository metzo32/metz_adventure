import HeroSection from "./_components/Components/HeroSection";
import FeatureGrid from "./_components/Components/FeatureGrid";
import CtaBanner from "./_components/Components/CtaBanner";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <HeroSection />
      <FeatureGrid />
      <CtaBanner />
    </div>
  );
}
