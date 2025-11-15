import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Eye, Download, Rocket } from "lucide-react";

interface Template {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
  previewUrl: string;
  downloadUrl: string;
}

const templates: Template[] = [
  {
    id: "zay",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format",
    category: "E-commerce",
    title: "Zay Ecommerce",
    description: "A modern, fully responsive e-commerce template with product showcases, shopping cart, and clean layouts.",
    rating: 4.9,
    reviews: 312,
    price: 5999,
    previewUrl: "/templates/zay/index.html",
    downloadUrl: "/templates/zay.zip",
  },
  {
    id: "motora",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&auto=format",
    category: "Automotive",
    title: "Motora Car Service",
    description: "Professional car service and automotive business template with service listings, contact forms, and clean UI.",
    rating: 4.8,
    reviews: 267,
    price: 6999,
    previewUrl: "/templates/motora/index.html",
    downloadUrl: "/templates/motora.zip",
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

                  <div className="space-y-2 pt-4">
                    <div className="flex gap-2">
                      <Button
                        asChild
                        variant="default"
                        className="flex-1"
                      >
                        <a href={template.previewUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1"
                      >
                        <a href={template.downloadUrl} download>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">
                        ₹{template.price}
                      </span>
                      <Button
                        variant="secondary"
                        className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default TemplatesShowcase;
