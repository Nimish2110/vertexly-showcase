import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminNotifications } from "@/contexts/AdminNotificationContext";
import { createOrder, submitRequirements } from "@/lib/api";
import { templates as templatesData } from "@/data/templates";

interface Template {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  price: number;
}

// Build lookup from centralized data
const templates: Record<string, Template> = templatesData.reduce((acc, t) => {
  acc[t.id] = {
    id: t.id,
    image: t.image,
    category: t.category,
    title: t.title,
    description: t.description,
    price: t.price,
  };
  return acc;
}, {} as Record<string, Template>);

const Checkout = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();
  const { addNotification } = useAdminNotifications();
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
      
      // Trigger admin notification for requirements submission
      addNotification({
        type: "requirements_update",
        message: `${user?.name || "A user"} submitted requirements for ${template.title}`,
        userName: user?.name || "Unknown User",
        templateName: template.title,
        orderId: orderId,
      });
      
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
                  className="text-primary underline mt-2 inline-block"
                >
                  View in Profile →
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
