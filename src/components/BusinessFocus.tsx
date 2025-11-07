import { Check, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const BusinessFocus = () => {
  const benefits = [
    "Save money with high-quality design",
    "Launch faster — zero coding needed",
    "Perfect for startups, portfolios & e-commerce",
  ];

  return (
    <section className="py-20 px-4 bg-muted">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <span className="text-2xl">💼</span>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Business / Startup Focus
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Transform your business vision into reality with our professional templates.
              Designed specifically for entrepreneurs and startups who need to move fast
              without compromising on quality.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-6 h-6 rounded-full gradient-cta flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground font-medium text-lg">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Play Button */}
          <div className="relative animate-fade-in animation-delay-200">
            <div className="relative h-96 flex items-center justify-center">
              <div className="absolute inset-0 gradient-primary rounded-3xl opacity-10"></div>
              <Button
                size="lg"
                className="w-24 h-24 rounded-full gradient-primary hover:scale-110 transition-transform duration-300 shadow-elegant"
                aria-label="Play video"
              >
                <Play className="w-8 h-8 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessFocus;
