import { Button } from "@/components/ui/button";
import { Star, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export interface TemplateCardProps {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
  previewUrl: string;
  animationDelay?: number;
}

const TemplateCard = ({
  id,
  image,
  category,
  title,
  description,
  rating,
  reviews,
  price,
  previewUrl,
  animationDelay = 0,
}: TemplateCardProps) => {
  return (
    <div
      className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant hover:-translate-y-2 transition-all duration-300 animate-fade-in group"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs uppercase font-semibold">
            {category}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold text-foreground line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-accent text-accent"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({rating}) based on {reviews}
          </span>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            asChild
            variant="default"
            className="w-full gradient-primary"
          >
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              Preview Website
            </a>
          </Button>
          <Button
            asChild
            variant="default"
            className="w-full gradient-primary"
          >
            <Link to={`/checkout/${id}`}>
              Checkout
            </Link>
          </Button>
          <div className="text-center">
            <span className="text-2xl font-bold text-foreground">
              ₹{price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
