import { Button } from "@/components/ui/button";
import { Diamond } from "lucide-react";

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

          {/* Right Illustration */}
          <div className="relative animate-fade-in animation-delay-200">
            <div className="relative w-full h-[500px] flex items-center justify-center">
              {/* Decorative circles */}
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse animation-delay-500"></div>
              
              {/* Central illustration placeholder */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-80 h-80 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-elegant hover:scale-105 transition-transform duration-500">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto bg-white/30 rounded-full flex items-center justify-center">
                      <Diamond className="w-16 h-16 text-white animate-pulse" />
                    </div>
                    <p className="text-white text-lg font-semibold">
                      Professional Templates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
