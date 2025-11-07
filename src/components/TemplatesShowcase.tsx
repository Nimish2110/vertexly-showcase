import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

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

const templates: Template[] = [
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
];

const TemplatesShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? templates.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === templates.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Explore Stunning Website Templates
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates
          </p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <div
                key={template.id}
                className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant hover:-translate-y-2 transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
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

          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Previous templates"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Next templates"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplatesShowcase;
