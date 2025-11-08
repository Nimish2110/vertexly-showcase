import { Check, Play, TrendingUp } from "lucide-react";

const AboutBusiness = () => {
  const businessPoints = [
    "Save money with high-quality design",
    "Launch faster — zero coding needed",
    "Perfect for startups, portfolios & e-commerce",
  ];

  const trustPoints = [
    "High-quality designs at a fraction of agency cost",
    "Fast loading, mobile-optimized websites",
    "Trusted by entrepreneurs, designers & digital agencies",
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        {/* Business Focus Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fade-in">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Business / Startup Focus
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Launch stunning websites in minutes — without hiring a designer. 
              Ready-to-use responsive templates built for startups, agencies & creators.
            </p>
            <ul className="space-y-4">
              {businessPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-center animate-fade-in">
            <button 
              className="w-32 h-32 rounded-full gradient-cta flex items-center justify-center shadow-elegant hover:scale-105 transition-transform duration-300"
              aria-label="Play video"
            >
              <Play className="w-12 h-12 text-white fill-white" />
            </button>
          </div>
        </div>

        {/* Value & Trust Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center order-2 md:order-1 animate-fade-in">
            <button 
              className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center shadow-elegant hover:scale-105 transition-transform duration-300"
              aria-label="Play video"
            >
              <Play className="w-12 h-12 text-white fill-white" />
            </button>
          </div>
          
          <div className="order-1 md:order-2 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Value & Trust Focus
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Professional quality at a price everyone can afford. Our templates are 
              trusted by thousands of businesses worldwide.
            </p>
            <ul className="space-y-4">
              {trustPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBusiness;
