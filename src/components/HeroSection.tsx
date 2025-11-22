import { Button } from "@/components/ui/button";
import { Diamond } from "lucide-react";
import Floating3D from "@/components/Floating3D";

const HeroSection = () => {
  return (
    <section className="min-h-screen gradient-primary flex items-center justify-center px-4 pt-20">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Your Vision,
              <br />
              Our Vertex.
            </h1>
            <p className="text-lg md:text-xl opacity-95 max-w-xl">
              Launch your website in minutes with stunning, professional templates.
              Perfect for startups, portfolios & e-commerce. No coding needed.
            </p>
            <Button
              size="lg"
              className="gradient-cta hover:scale-105 transition-transform duration-300 text-white font-semibold uppercase shadow-elegant group"
            >
              <Diamond className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Explore Templates
            </Button>
          </div>

          {/* Right Illustration - Floating 3D Element */}
          <div className="relative animate-fade-in animation-delay-200">
            <div className="relative w-full h-[500px]">
              <Floating3D />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
