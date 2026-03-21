import HeroSection from "./_components/HeroSection";
import FeatureGrid from "./_components/FeatureGrid";
import CtaBanner from "./_components/CtaBanner";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <HeroSection />
      <FeatureGrid />
      <CtaBanner />
    </div>
  );
}
