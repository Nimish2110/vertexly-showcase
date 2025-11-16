import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Eye } from "lucide-react";

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
    price: 5000,
    previewUrl: "/templates/zay/index.html",
    downloadUrl: "",
  },
  {
    id: "motora",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&auto=format",
    category: "Automotive",
    title: "Motora Car Service",
    description: "Professional car service and automotive business template with service listings, contact forms, and clean UI.",
    rating: 4.8,
    reviews: 267,
    price: 6000,
    previewUrl: "/templates/motora/index.html",
    downloadUrl: "",
  },
  {
    id: "famms",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&auto=format",
    category: "Fashion & Retail",
    title: "Famms Fashion Store",
    description: "Stylish fashion e-commerce template with elegant product displays, testimonials, and modern design perfect for clothing stores.",
    rating: 4.7,
    reviews: 189,
    price: 6500,
    previewUrl: "/templates/famms/index.html",
    downloadUrl: "",
  },
  {
    id: "podtalk",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&auto=format",
    category: "Media & Podcast",
    title: "Pod Talk Podcast",
    description: "Modern podcast template with audio player integration, episode listings, and beautiful wave animations for content creators.",
    rating: 4.8,
    reviews: 234,
    price: 7000,
    previewUrl: "/templates/podtalk/index.html",
    downloadUrl: "",
  },
  {
    id: "glossytouch",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format",
    category: "Creative Portfolio",
    title: "Glossy Touch Portfolio",
    description: "Eye-catching portfolio template with smooth animations, modern design, and perfect showcase for creative professionals.",
    rating: 4.9,
    reviews: 276,
    price: 7500,
    previewUrl: "/templates/glossytouch/index.html",
    downloadUrl: "",
  },
  {
    id: "urotaxi",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&auto=format",
    category: "Transportation",
    title: "UroTaxi Service",
    description: "Professional taxi and transportation service template with booking features, service highlights, and clean modern interface.",
    rating: 4.6,
    reviews: 198,
    price: 8000,
    previewUrl: "/templates/urotaxi/index.html",
    downloadUrl: "",
  },
];

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

                  <div className="space-y-3 pt-4">
                    <Button
                      asChild
                      variant="default"
                      className="w-full gradient-primary"
                    >
                      <a href={template.previewUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Website
                      </a>
                    </Button>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-foreground">
                        ₹{template.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <a href="/templates">View All Templates</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TemplatesShowcase;
