import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import TemplatesShowcase from "@/components/TemplatesShowcase";
import BusinessFocus from "@/components/BusinessFocus";
import ValueTrust from "@/components/ValueTrust";
import Experts from "@/components/Experts";
import LaunchPromo from "@/components/LaunchPromo";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeatureCards />
      <TemplatesShowcase />
      <BusinessFocus />
      <ValueTrust />
      <Experts />
      <LaunchPromo />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
