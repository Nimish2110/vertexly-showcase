import { Layout, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Layout,
    title: "100+ Website Templates",
    description: "Choose from our extensive collection of professionally designed templates for any industry or purpose.",
  },
  {
    icon: Zap,
    title: "Launch in Minutes",
    description: "Get your website live fast with our easy-to-use platform. No technical skills required.",
  },
  {
    icon: Shield,
    title: "Mobile Optimized",
    description: "All templates are fully responsive and optimized for perfect display on any device.",
  },
];

const FeatureCards = () => {
  return (
    <section className="py-20 px-4 bg-muted">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-background rounded-2xl p-8 shadow-soft hover:shadow-elegant hover:-translate-y-2 transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
