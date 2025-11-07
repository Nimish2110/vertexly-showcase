import { Check } from "lucide-react";

const ValueTrust = () => {
  const values = [
    "High-quality designs at a fraction of agency cost",
    "Fast loading, mobile-optimized websites",
    "Trusted by entrepreneurs, designers & digital agencies",
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Visual */}
          <div className="relative animate-fade-in order-2 lg:order-1">
            <div className="relative h-96 flex items-center justify-center">
              <div className="absolute inset-0 gradient-primary rounded-3xl opacity-10"></div>
              <div className="relative z-10 space-y-8">
                {[1, 2, 3].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 rounded-full gradient-cta flex items-center justify-center animate-pulse">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-48 h-2 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8 animate-fade-in animation-delay-200 order-1 lg:order-2">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <span className="text-2xl">🛡️</span>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Value & Trust Focus
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe quality shouldn't break the bank. Our templates deliver enterprise-level
              design at startup-friendly prices, backed by a community that trusts us.
            </p>

            <ul className="space-y-4">
              {values.map((value, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-6 h-6 rounded-full gradient-cta flex items-center justify-center flex-shrink-0 mt-1 animate-pulse">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground font-medium text-lg">
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueTrust;
