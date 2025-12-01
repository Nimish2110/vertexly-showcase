import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Puzzle } from "lucide-react";
import { Link } from "react-router-dom";
import TemplateCard from "@/components/TemplateCard";
import { templates } from "@/data/templates";

const Templates = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="gradient-primary pt-32 pb-20 px-4">
        <div className="container mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Our Templates
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/90">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>|</span>
            <span>Services</span>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-20 px-4 bg-background flex-grow">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Puzzle className="w-8 h-8 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold text-gradient">
                Explore Stunning Website Templates
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {templates.map((template, index) => (
              <TemplateCard
                key={template.id}
                {...template}
                animationDelay={index * 50}
              />
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              { title: "60+ UX Templates", icon: "🎨" },
              { title: "Expert Instructors", icon: "👨‍🏫" },
              { title: "Lifetime Access", icon: "♾️" },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elegant hover:-translate-y-2 transition-all duration-300 text-center animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Templates;
