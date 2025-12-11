import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder, submitRequirements } from "@/lib/api";

interface Template {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  price: number;
}

const templates: Record<string, Template> = {
  zay: {
    id: "zay",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format",
    category: "E-commerce",
    title: "Zay Ecommerce",
    description: "A modern, fully responsive e-commerce template with product showcases, shopping cart, and clean design perfect for online stores.",
    price: 5000,
  },
  motora: {
    id: "motora",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&auto=format",
    category: "Automotive",
    title: "Motora Car Service",
    description: "Professional car service and automotive business template with service listings, contact forms, and stunning visual design.",
    price: 6000,
  },
  famms: {
    id: "famms",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&auto=format",
    category: "Fashion & Retail",
    title: "Famms Fashion Store",
    description: "Stylish fashion e-commerce template with elegant product displays, testimonials, and modern design perfect for clothing stores.",
    price: 6500,
  },
  podtalk: {
    id: "podtalk",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&auto=format",
    category: "Media & Podcast",
    title: "Pod Talk Podcast",
    description: "Modern podcast template with audio player integration, episode listings, and beautiful wave animations for content creators.",
    price: 7000,
  },
  glossytouch: {
    id: "glossytouch",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format",
    category: "Creative Portfolio",
    title: "Glossy Touch Portfolio",
    description: "Eye-catching portfolio template with smooth animations, modern design, and perfect showcase for creative professionals.",
    price: 7500,
  },
  urotaxi: {
    id: "urotaxi",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&auto=format",
    category: "Transportation",
    title: "UroTaxi Service",
    description: "Professional taxi and transportation service template with booking features, service highlights, and clean modern interface.",
    price: 8000,
  },
};

const Checkout = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");
  const [showRequirements, setShowRequirements] = useState(false);
  const [requirements, setRequirements] = useState("");
  const [requirementsSubmitted, setRequirementsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const template = templateId ? templates[templateId] : null;

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Template Not Found</h1>
          <Link to="/templates">
            <Button className="gradient-primary">Back to Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  const customizationCharges = 500;
  const discount = discountCode.toLowerCase() === "welcome10" ? template.price * 0.1 : 0;
  const totalAmount = template.price + customizationCharges - discount;

  const handleMoveToRequirements = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to continue with your order.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    
    // Create the order first
    const { data, error } = await createOrder({
  templateId: template.id,
  customizationPrice: 500,
  discount: discount,
});

console.log("RAW ORDER RESPONSE →", data);

if (data && data.order) {
  setOrderId(data.order._id);
  setShowRequirements(true);
} else {
  toast({
    title: "Error",
    description: error || "Failed to create order",
    variant: "destructive",
  });
}

  const handleRequirementsSubmit = async () => {
    if (!requirements.trim()) {
      toast({
        title: "Requirements Required",
        description: "Please enter your website requirements before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!orderId) {
      toast({
        title: "Error",
        description: "Order not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const { data, error } = await submitRequirements(orderId, requirements);

    if (data) {
  console.log("REQUIREMENTS SUBMITTED RESPONSE →", data);

  setRequirementsSubmitted(true);

  toast({
    title: "Requirements Submitted",
    description: "Your requirements were saved successfully!",
  });
} else {
      toast({
        title: "Error",
        description: error || "Failed to submit requirements",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-gradient">Vertexly</h1>
          </Link>
          <h2 className="text-3xl font-bold text-foreground mb-2">Website Invoice</h2>
          <p className="text-muted-foreground">Complete your template purchase</p>
        </div>

        {/* Invoice Card */}
        <div className="bg-card rounded-2xl shadow-elegant p-8 mb-6">
          {/* Template Details */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={template.image}
                alt={template.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs uppercase font-semibold mb-2">
                {template.category}
              </span>
              <h3 className="text-2xl font-bold text-foreground mb-2">{template.title}</h3>
              <p className="text-muted-foreground text-sm">{template.description}</p>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-foreground">Base Price</span>
              <span className="text-foreground font-semibold">₹{template.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground">Customization Charges</span>
              <span className="text-foreground font-semibold">₹{customizationCharges.toLocaleString()}</span>
            </div>

            {/* Discount Code Input */}
            <div className="space-y-2">
              <Label htmlFor="discount">Discount Code</Label>
              <Input
                id="discount"
                type="text"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              {discount > 0 && (
                <p className="text-sm text-green-600">Discount applied: -₹{discount.toLocaleString()}</p>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="text-xl font-bold text-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-gradient">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Move to Requirements Button */}
          {!showRequirements && (
            <Button
              onClick={handleMoveToRequirements}
              className="w-full mt-6 gradient-primary"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Move to Requirements"}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Requirements Section */}
        {showRequirements && (
          <div className="bg-card rounded-2xl shadow-elegant p-8 mb-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-foreground">Tell us about your requirements</h3>
              <button
                onClick={() => setShowRequirements(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronUp className="w-6 h-6" />
              </button>
            </div>

            {!requirementsSubmitted ? (
              <>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Write your website requirements here..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </div>

                <Button
                  onClick={handleRequirementsSubmit}
                  className="w-full mt-6 gradient-primary"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Confirm Requirements"}
                </Button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    Your requirements have been received. Check your project status in your profile.
                  </p>
                  <Link to="/profile" className="text-primary hover:underline text-sm mt-2 inline-block">
                    Go to Profile →
                  </Link>
                </div>

                <Button
                  disabled
                  className="w-full bg-muted text-muted-foreground cursor-not-allowed"
                  size="lg"
                >
                  Awaiting Developer Acceptance
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link to="/templates" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Templates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
