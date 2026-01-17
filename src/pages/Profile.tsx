import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Home, Download, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getMyOrders, createOrder, downloadDelivery, createPayment, verifyPayment, Order } from "@/lib/api";
import { useRazorpay, RazorpayResponse } from "@/hooks/useRazorpay";
import AuthHeader from "@/components/AuthHeader";
import AuthButton from "@/components/AuthButton";
import StatusIcon from "@/components/StatusIcon";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn, isLoading: authLoading } = useAuth();
  const { openRazorpay } = useRazorpay();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [websiteType, setWebsiteType] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [customRequirements, setCustomRequirements] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate("/login");
    }
  }, [authLoading, isLoggedIn, navigate]);

  const fetchOrders = async () => {
    if (!isLoggedIn) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await getMyOrders();
      if (data && Array.isArray(data) && !error) {
        setOrders(data);
      } else if (error) {
        console.error("Failed to fetch orders:", error);
        toast.error(error);
      }
    } catch (err) {
      console.error("Unexpected error fetching orders:", err);
      toast.error("Failed to load orders");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCustomSubmit = async () => {
    if (!websiteType || !businessType || !deliveryTime || !customRequirements) {
      toast.error("Please fill in all fields");
      return;
    }

    const deliveryPrices: Record<string, number> = {
      "48-hours": 15000,
      "3-days": 12000,
      "5-days": 10000,
      "7-days": 8000,
    };

    setIsSubmitting(true);
    const { data, error } = await createOrder({
      templateId: "custom",
      customizationPrice: deliveryPrices[deliveryTime] || 10000,
      discount: 0,
    });

    if (data && !error) {
      // Refresh orders after creating
      await fetchOrders();
      setSubmitSuccess(true);
      setWebsiteType("");
      setBusinessType("");
      setDeliveryTime("");
      setCustomRequirements("");
      toast.success("Custom website request submitted!");
      setTimeout(() => setSubmitSuccess(false), 3000);
    } else {
      toast.error(error || "Failed to submit request");
    }
    setIsSubmitting(false);
  };

  const handleDownload = async (orderId: string, templateName: string) => {
    const safeTemplateName = templateName || "download";
    const { data, error } = await downloadDelivery(orderId);
    if (data && !error) {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeTemplateName.replace(/\s+/g, "-").toLowerCase()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started!");
    } else {
      toast.error(error || "Download failed");
    }
  };

  const handlePayNow = async (order: Order) => {
    const orderId = order._id;
    setPayingOrderId(orderId);

    const { data, error } = await createPayment(orderId);
    if (error || !data) {
      toast.error(error || "Failed to initiate payment");
      setPayingOrderId(null);
      return;
    }
    // Map backend response: { orderId, amount, currency, key }
    const paymentData = {
      orderId: orderId,
      razorpayOrderId: data.orderId, // Backend returns 'orderId' as Razorpay order ID
      key: data.key, // Backend returns 'key' as Razorpay key
      amount: data.amount,
      currency: data.currency || "INR",
    };

    const prefill = {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
    };

    openRazorpay(
      paymentData,
      prefill,
      async (response: RazorpayResponse) => {
        // Verify payment on success
        const verifyResult = await verifyPayment({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          orderId: orderId,
        });

        if (verifyResult.error) {
          toast.error(verifyResult.error);
        } else {
          toast.success("Payment successful!");
          // Refresh orders to update payment status
          await fetchOrders();
        }
        setPayingOrderId(null);
      },
      () => {
        // On dismiss
        setPayingOrderId(null);
      }
    );
  };

  // Helper to check if payment button should be shown
  const shouldShowPayButton = (order: Order): boolean => {
    const paymentStatus = order?.paymentStatus;
    const developerStatus = order?.developerStatus;
    
    // Show Pay Now button if order is accepted AND payment is not completed
    return developerStatus === "accepted" && paymentStatus !== "paid";
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <AuthHeader
            title="My Profile"
            subtitle="Manage your website purchases and requests"
          />
        </div>

        {/* User Info Card */}
        <div className="bg-card rounded-2xl shadow-elegant p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {user?.name || "User"}
              </h2>
              <p className="text-muted-foreground">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Acceptance Notification Banner */}
        {orders.some(order => order?.developerStatus === "accepted" && order?.paymentStatus !== "paid" && order?.paymentStatus !== "completed") && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🎉</span>
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium">
                The developer has accepted your order. Pay now to start building your website.
              </p>
              <p className="text-muted-foreground text-sm">
                Complete your payment to proceed with development.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Table */}
        <div className="bg-card rounded-2xl shadow-elegant p-6 mb-8 overflow-x-auto">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            My Website Purchases
          </h3>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No orders yet. Start by selecting a template!
            </p>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                    Template Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                    Requirements
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                    Date
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                    Developer Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                    Payment
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                    Delivery
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const orderId = order?._id || "";
                  const templateName = order?.templateName || "Unknown Template";
                  const price = order?.totalPrice || order?.price || 0;
                  const requirements = order?.requirements || "";
                  const createdAt = order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A";
                  const developerStatus = order?.developerStatus ?? order?.status;
                  const paymentStatus = order?.paymentStatus;
                  const isCustom = order?.isCustom;
                  const deliveryStatus = order?.deliveryStatus ?? order?.status;
                  const hasDelivery = (order?.status === "completed" || order?.developerStatus === "completed") && 
                                       (order?.downloadLink || order?.deliveryFile);
                  
                  // Payment is complete
                  const isPaid = paymentStatus === "paid" || paymentStatus === "completed";
                  // Order accepted and awaiting payment
                  const isAwaitingPayment = developerStatus === "accepted" && !isPaid;
                  
                  return (
                    <tr
                      key={orderId}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-foreground font-medium">
                        {templateName}
                        {isCustom && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Custom
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-foreground">
                        ₹{price.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground text-sm max-w-[200px] truncate">
                        {requirements || "Not submitted"}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {createdAt}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <StatusIcon
                            status={developerStatus}
                            type="icon"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {isPaid ? (
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 font-medium">
                                Paid
                              </span>
                              <span className="text-green-600 font-medium text-sm">
                                ₹{price.toLocaleString()}
                              </span>
                            </div>
                          ) : isAwaitingPayment ? (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handlePayNow(order)}
                                disabled={payingOrderId === orderId}
                                className="gradient-cta text-white text-xs h-8 px-4"
                              >
                                {payingOrderId === orderId ? (
                                  <>
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  `Pay Now ₹${price.toLocaleString()}`
                                )}
                              </Button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Awaiting acceptance
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center items-center gap-2">
                          <StatusIcon status={deliveryStatus} type="dot" />
                          {hasDelivery && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownload(orderId, templateName)}
                              className="text-primary hover:text-primary/80"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Custom Website Builder */}
        <div className="bg-card rounded-2xl shadow-elegant p-6 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Build Your Own Custom Website
          </h3>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
              Your custom website request has been submitted successfully!
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Type of Website</Label>
              <Select value={websiteType} onValueChange={setWebsiteType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="landing">Landing Page</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Business or Personal</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Delivery Time</Label>
              <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="48-hours">48 Hours (₹15,000)</SelectItem>
                  <SelectItem value="3-days">3 Days (₹12,000)</SelectItem>
                  <SelectItem value="5-days">5 Days (₹10,000)</SelectItem>
                  <SelectItem value="7-days">7 Days (₹8,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Label>Describe your requirements</Label>
            <Textarea
              placeholder="Write your website requirements here..."
              value={customRequirements}
              onChange={(e) => setCustomRequirements(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <AuthButton 
            variant="primary" 
            onClick={handleCustomSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </AuthButton>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;