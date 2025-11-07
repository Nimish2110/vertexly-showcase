import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Expert {
  id: string;
  name: string;
  role: string;
  image: string;
}

const experts: Expert[] = [
  {
    id: "1",
    name: "Mr. Arafat",
    role: "UX Design Expert",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format",
  },
  {
    id: "2",
    name: "Mr. Saiful",
    role: "Web Development Lead",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format",
  },
  {
    id: "3",
    name: "Mr. Urela",
    role: "Design Strategy",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format",
  },
  {
    id: "4",
    name: "Mr. Uttom",
    role: "Frontend Specialist",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format",
  },
];

const Experts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? experts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === experts.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 px-4 bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Community Experts
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Meet the talented professionals behind our templates
          </p>
        </div>

        <div className="relative">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {experts.map((expert, index) => (
              <div
                key={expert.id}
                className="text-center space-y-4 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative w-40 h-40 mx-auto">
                  <div className="absolute inset-0 rounded-full gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="relative w-full h-full object-cover rounded-full border-4 border-background shadow-elegant group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {expert.name}
                  </h3>
                  <p className="text-muted-foreground">{expert.role}</p>
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
              aria-label="Previous experts"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              aria-label="Next experts"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experts;
