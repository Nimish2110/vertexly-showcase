import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Puzzle, Filter, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import TemplateCard from "@/components/TemplateCard";
import { templates } from "@/data/templates";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const filterOptions = [
  { label: "All", value: "All" },
  { label: "Business Templates", value: "Business" },
  { label: "Portfolio Templates", value: "Portfolio" },
  { label: "E-commerce Templates", value: "E-commerce" },
  { label: "Landing Pages", value: "Landing" },
  { label: "Blog Templates", value: "Blog" },
];

const Templates = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [selectedFilter, setSelectedFilter] = useState(initialCategory);

  // Update filter when URL param changes
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedFilter(categoryParam);
    }
  }, [searchParams]);

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    if (value === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  const filteredTemplates = useMemo(() => {
    if (selectedFilter === "All") {
      return templates;
    }
    return templates.filter((template) => template.category === selectedFilter);
  }, [selectedFilter]);

  const currentFilterLabel = filterOptions.find(f => f.value === selectedFilter)?.label || "All";

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

          {/* Filter Dropdown */}
          <div className="flex justify-end mb-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-card border-border">
                  <Filter className="w-4 h-4" />
                  {currentFilterLabel}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`cursor-pointer ${selectedFilter === option.value ? "bg-primary/10 text-primary" : ""}`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                {...template}
                animationDelay={index * 50}
              />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No templates found in this category.</p>
            </div>
          )}

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
