import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, Puzzle } from "lucide-react";
import { Link } from "react-router-dom";

interface Template {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
}

const allTemplates: Template[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format",
    category: "User Experience",
    title: "Fundamental of UX for Application design",
    description: "The automated process all your website tasks. Discover tools and techniques to engage effectively.",
    rating: 4.5,
    reviews: 120,
    price: 135,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format",
    category: "Web Development",
    title: "Modern Web Development Essentials",
    description: "Learn the latest web technologies and build stunning responsive websites from scratch.",
    rating: 4.8,
    reviews: 245,
    price: 149,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format",
    category: "Mobile Design",
    title: "Mobile-First Design Principles",
    description: "Master mobile-first design strategies and create exceptional mobile experiences.",
    rating: 4.6,
    reviews: 189,
    price: 125,
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&auto=format",
    category: "E-commerce",
    title: "Complete E-commerce Solution",
    description: "Build your online store with this comprehensive e-commerce template.",
    rating: 4.7,
    reviews: 156,
    price: 159,
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format",
    category: "Portfolio",
    title: "Creative Portfolio Showcase",
    description: "Showcase your work beautifully with this modern portfolio template.",
    rating: 4.9,
    reviews: 203,
    price: 119,
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format",
    category: "Business",
    title: "Corporate Business Template",
    description: "Professional business template perfect for agencies and consultancies.",
    rating: 4.5,
    reviews: 178,
    price: 145,
  },
];

const Templates = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, allTemplates.length));
  };

  const visibleTemplates = allTemplates.slice(0, visibleCount);

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
            {visibleTemplates.map((template, index) => (
              <div
                key={template.id}
                className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant hover:-translate-y-2 transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs uppercase font-semibold">
                      {template.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-foreground line-clamp-2">
                    {template.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(template.rating)
                              ? "fill-accent text-accent"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({template.rating}) based on {template.reviews}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-bold text-foreground">
                      ${template.price}
                    </span>
                    <Button
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      Find Out More
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < allTemplates.length && (
            <div className="text-center">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
                className="border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300"
              >
                Load More
              </Button>
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
