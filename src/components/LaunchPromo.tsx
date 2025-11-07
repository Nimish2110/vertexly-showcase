import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const LaunchPromo = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative animate-fade-in">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-elegant">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format"
                alt="Developer at work"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-transparent"></div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8 animate-fade-in animation-delay-200">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Launch your website in minutes — without hiring a developer.
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Our premium templates are designed by professionals and optimized for
              performance. Simply choose a template, customize it to your needs, and
              launch. It's that simple.
            </p>

            <ul className="space-y-3">
              {[
                "No technical skills required",
                "Professional designs ready to use",
                "Mobile-responsive out of the box",
                "SEO optimized for better rankings",
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-foreground animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Sparkles className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              className="gradient-cta hover:scale-105 transition-transform duration-300 text-white font-semibold uppercase shadow-elegant"
            >
              Explore Premium Templates
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaunchPromo;
