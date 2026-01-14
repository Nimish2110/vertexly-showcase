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
    description: "A modern, fully responsive e-commerce template.",
    price: 5000,
  },
  motora: {
    id: "motora",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&auto=format",
    category: "Automotive",
    title: "Motora Car Service",
    description: "Professional automotive template.",
    price: 6000,
  },
  famms: {
    id: "famms",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&auto=format",
    category: "Fashion & Retail",
    title: "Famms Fashion Store",
    description: "Modern fashion storefront template.",
    price: 6500,
  },
  podtalk: {
    id: "podtalk",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&auto=format",
    category: "Media & Podcast",
    title: "Pod Talk Podcast",
    description: "Podcast template with audio integration.",
    price: 7000,
  },
  glossytouch: {
    id: "glossytouch",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format",
    category: "Creative Portfolio",
    title: "Glossy Touch Portfolio",
    description: "Portfolio for creative professionals.",
    price: 7500,
  },
  urotaxi: {
    id: "urotaxi",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&auto=format",
    category: "Transportation",
    title: "UroTaxi Service",
    description: "Taxi and transport service template.",
    price: 8000,
  },
  petsitting: {
    id: "petsitting",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&auto=format",
    category: "Pet Services",
    title: "Pet Sitting Pro",
    description: "Professional pet sitting service template.",
    price: 5500,
  },
  anipat: {
    id: "anipat",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&auto=format",
    category: "Pet Services",
    title: "AniPat Pet Care",
    description: "Modern pet care and veterinary template.",
    price: 6000,
  },
  petcare: {
    id: "petcare",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format",
    category: "Pet Services",
    title: "PetCare Plus",
    description: "Comprehensive pet care service template.",
    price: 5800,
  },
  bustraveller: {
    id: "bustraveller",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format",
    category: "Travel",
    title: "Bus Traveller",
    description: "Bus travel and tour booking template.",
    price: 6500,
  },
  mosaic: {
    id: "mosaic",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format",
    category: "Construction",
    title: "Mosaic Construction",
    description: "Professional construction company template.",
    price: 7000,
  },
  archlab: {
    id: "archlab",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&auto=format",
    category: "Architecture",
    title: "ArchLab Studio",
    description: "Elegant architecture studio template.",
    price: 7500,
  },
  "ashion-master": {
    id: "ashion-master",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format",
    category: "E-commerce",
    title: "Ashion Master Store",
    description: "Premium fashion e-commerce template.",
    price: 6500,
  },
  eventcon: {
    id: "eventcon",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format",
    category: "Events",
    title: "EventCon Conference",
    description: "Event and conference template.",
    price: 7000,
  },
  foodmart: {
    id: "foodmart",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format",
    category: "Wholesale",
    title: "FoodMart Wholesale",
    description: "Wholesale and grocery store template.",
    price: 6000,
  },
  rentu: {
    id: "rentu",
    image: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=500&auto=format",
    category: "Car Rental",
    title: "RentU Car Rental",
    description: "Car rental and vehicle leasing template.",
    price: 7500,
  },
  accounting: {
    id: "accounting",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&auto=format",
    category: "Finance",
    title: "Accounting Pro",
    description: "Professional accounting and financial services template.",
    price: 6500,
  },
  acuas: {
    id: "acuas",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format",
    category: "Aquatics",
    title: "Acuas Aquarium",
    description: "Beautiful aquarium and aquatic life template.",
    price: 5500,
  },
  aranoz: {
    id: "aranoz",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format",
    category: "E-commerce",
    title: "Aranoz Furniture",
    description: "Elegant furniture e-commerce template.",
    price: 7000,
  },
  archi: {
    id: "archi",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500&auto=format",
    category: "Architecture",
    title: "Archi Design Studio",
    description: "Modern architecture and interior design template.",
    price: 7500,
  },
  asthetic: {
    id: "asthetic",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=500&auto=format",
    category: "Beauty & Wellness",
    title: "Asthetic Clinic",
    description: "Premium aesthetic and beauty clinic template.",
    price: 8000,
  },
  brber: {
    id: "brber",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&auto=format",
    category: "Barber & Salon",
    title: "Brber Barbershop",
    description: "Stylish barbershop template.",
    price: 5500,
  },
  coffee: {
    id: "coffee",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format",
    category: "Food & Beverage",
    title: "Coffee House",
    description: "Warm and inviting coffee shop template.",
    price: 5000,
  },
  courier: {
    id: "courier",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&auto=format",
    category: "Logistics",
    title: "Courier Express",
    description: "Professional courier and delivery service template.",
    price: 6000,
  },
  cyborg: {
    id: "cyborg",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format",
    category: "Technology",
    title: "Cyborg Tech",
    description: "Futuristic technology and AI company template.",
    price: 8500,
  },
  organic: {
    id: "organic",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format",
    category: "Organic & Health",
    title: "Organic Market",
    description: "Fresh organic food and health products template.",
    price: 6500,
  },
  cycle: {
    id: "cycle",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&auto=format",
    category: "Sports & Fitness",
    title: "Cycle Shop",
    description: "Modern bicycle and cycling gear store template.",
    price: 6000,
  },
  dentcare: {
    id: "dentcare",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&auto=format",
    category: "Healthcare",
    title: "DentCare Clinic",
    description: "Professional dental clinic template.",
    price: 7000,
  },
  edumark: {
    id: "edumark",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format",
    category: "Education",
    title: "EduMark Academy",
    description: "Modern education and learning platform template.",
    price: 6500,
  },
  eduwell: {
    id: "eduwell",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format",
    category: "Education",
    title: "EduWell Institute",
    description: "Comprehensive educational institute template.",
    price: 7000,
  },
  esier: {
    id: "esier",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format",
    category: "Business",
    title: "Esier Business",
    description: "Clean and professional business template.",
    price: 5500,
  },
  esscence: {
    id: "esscence",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format",
    category: "Beauty & Cosmetics",
    title: "Esscence Beauty",
    description: "Elegant beauty and cosmetics store template.",
    price: 7500,
  },
  faster: {
    id: "faster",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format",
    category: "Logistics",
    title: "Faster Delivery",
    description: "Fast delivery and shipping service template.",
    price: 6000,
  },
  "footwear-master": {
    id: "footwear-master",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format",
    category: "E-commerce",
    title: "Footwear Master",
    description: "Premium footwear and shoe store template.",
    price: 7000,
  },
  "furn-master": {
    id: "furn-master",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format",
    category: "E-commerce",
    title: "Furn Master",
    description: "Stylish furniture store template.",
    price: 7500,
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
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Template Not Found</h1>
      </div>
    );
  }

  const customizationCharges = 500;
  const discount = discountCode.toLowerCase() === "welcome10" ? template.price * 0.1 : 0;
  const totalAmount = template.price + customizationCharges - discount;

  // =============================
  // CREATE ORDER
  // =============================
  const handleMoveToRequirements = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to continue.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await createOrder({
      templateId: template.id,
      customizationPrice: 500,
      discount,
    });

    console.log("ORDER RESPONSE →", data);

    if (data && data._id) {
      setOrderId(data._id); // SAVE THE ORDER ID
      setShowRequirements(true);
    } else {
      toast({
        title: "Error",
        description: error || "Order creation failed",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  // =============================
  // SUBMIT REQUIREMENTS
  // =============================
  const handleRequirementsSubmit = async () => {
    if (!requirements.trim()) {
      toast({
        title: "Requirements Missing",
        description: "Please write your requirements.",
        variant: "destructive",
      });
      return;
    }

    if (!orderId) {
      toast({
        title: "Error",
        description: "Order not found.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await submitRequirements(orderId, requirements);

    console.log("REQUIREMENTS RESPONSE →", data);

    if (data) {
      setRequirementsSubmitted(true);
      toast({
        title: "Requirements Submitted",
        description: "Your requirements were saved!",
      });
    } else {
      toast({
        title: "Error",
        description: error || "Requirements failed.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">

        <h2 className="text-3xl font-bold mb-4">Website Invoice</h2>

        {/* --- TEMPLATE CARD --- */}
        <div className="bg-card p-6 rounded-xl shadow mb-6">
          <div className="flex gap-4">
            <img src={template.image} className="w-40 h-28 rounded-lg object-cover" />
            <div>
              <p className="text-sm text-primary">{template.category}</p>
              <h3 className="text-xl font-bold">{template.title}</h3>
              <p className="text-muted-foreground">{template.description}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <span>Base Price</span>
              <span>₹{template.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Customization</span>
              <span>₹500</span>
            </div>

            <div>
              <Label>Discount Code</Label>
              <Input
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Enter code"
              />
            </div>

            <div className="flex justify-between border-t pt-3 font-bold text-lg">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {!showRequirements && (
            <Button
              className="w-full mt-6"
              disabled={isSubmitting}
              onClick={handleMoveToRequirements}
            >
              {isSubmitting ? "Processing..." : "Move to Requirements"}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* --- REQUIREMENTS FORM --- */}
        {showRequirements && (
          <div className="bg-card p-6 rounded-xl shadow mb-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">Your Requirements</h3>
              <button onClick={() => setShowRequirements(false)}>
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>

            {!requirementsSubmitted ? (
              <>
                <Textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Write your website requirements…"
                  className="min-h-[200px]"
                />

                <Button
                  className="w-full mt-4"
                  onClick={handleRequirementsSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Confirm Requirements"}
                </Button>
              </>
            ) : (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-800 font-medium">
                  Your requirements have been submitted!
                </p>
                <Link
                  to="/profile"
                  className="text-primary underline text-sm mt-2 inline-block"
                >
                  Go to Profile →
                </Link>
              </div>
            )}
          </div>
        )}

        <Link to="/templates" className="text-sm underline">
          ← Back to Templates
        </Link>
      </div>
    </div>
  );
};

export default Checkout;
