import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TemplateCard from "@/components/TemplateCard";
import { templates } from "@/data/templates";

const TemplatesShowcase = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Our Best Templates
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose your perfect design — ready to launch in 48 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {templates.slice(0, 3).map((template, index) => (
            <TemplateCard
              key={template.id}
              {...template}
              animationDelay={index * 100}
            />
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link to="/templates">View All Templates</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TemplatesShowcase;
