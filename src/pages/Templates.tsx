import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, Puzzle, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface Template {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  price?: number;
  previewUrl?: string;
  downloadUrl?: string;
  isRealTemplate?: boolean;
}

const allTemplates: Template[] = [
  {
    id: "zay",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format",
    category: "E-commerce",
    title: "Zay Ecommerce",
    description: "A modern, fully responsive e-commerce template with product showcases, shopping cart, and clean design perfect for online stores.",
    rating: 4.9,
    reviews: 312,
    price: 5000,
    previewUrl: "/templates/zay/index.html",
    downloadUrl: "",
    isRealTemplate: true,
  },
  {
    id: "motora",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&auto=format",
    category: "Automotive",
    title: "Motora Car Service",
    description: "Professional car service and automotive business template with service listings, contact forms, and stunning visual design.",
    rating: 4.8,
    reviews: 267,
    price: 6000,
    previewUrl: "/templates/motora/index.html",
    downloadUrl: "",
    isRealTemplate: true,
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
    isRealTemplate: true,
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
    isRealTemplate: true,
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
    isRealTemplate: true,
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
    isRealTemplate: true,
  },
];

const Templates = () => {

  return (
    <div className="min-h-screen flex flex-col animate-slide-up">
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
            {allTemplates.map((template, index) => (
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
