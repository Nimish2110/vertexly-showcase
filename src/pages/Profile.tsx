import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useAuth, Purchase } from "@/contexts/AuthContext";
import AuthHeader from "@/components/AuthHeader";
import AuthButton from "@/components/AuthButton";
import StatusIcon from "@/components/StatusIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Profile = () => {
  const navigate = useNavigate();
  const { user, purchases, logout, addPurchase } = useAuth();
  const [websiteType, setWebsiteType] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [customRequirements, setCustomRequirements] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCustomSubmit = () => {
    if (!websiteType || !businessType || !deliveryTime || !customRequirements) {
      return;
    }

    const deliveryPrices: Record<string, number> = {
      "48-hours": 15000,
      "3-days": 12000,
      "5-days": 10000,
      "7-days": 8000,
    };

    addPurchase({
      templateName: "Custom Website",
      price: deliveryPrices[deliveryTime] || 10000,
      requirements: customRequirements,
      selectedDate: new Date().toISOString().split("T")[0],
      developerStatus: "pending",
      paymentStatus: "pending",
      deliveryStatus: "pending",
      isCustom: true,
      websiteType,
      businessType,
      deliveryTime,
    });

    setSubmitSuccess(true);
    setWebsiteType("");
    setBusinessType("");
    setDeliveryTime("");
    setCustomRequirements("");

    setTimeout(() => setSubmitSuccess(false), 3000);
  };

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
                {user?.name || "John Doe"}
              </h2>
              <p className="text-muted-foreground">
                {user?.email || "john@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Table */}
        <div className="bg-card rounded-2xl shadow-elegant p-6 mb-8 overflow-x-auto">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            My Website Purchases
          </h3>
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
                  Selected Date
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                  Developer Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                  Payment Status
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                  Delivery Status
                </th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase: Purchase) => (
                <tr
                  key={purchase.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-4 px-4 text-foreground font-medium">
                    {purchase.templateName}
                    {purchase.isCustom && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Custom
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-foreground">
                    ₹{purchase.price.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-muted-foreground text-sm max-w-[200px] truncate">
                    {purchase.requirements}
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    {purchase.selectedDate}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <StatusIcon
                        status={purchase.developerStatus}
                        type="icon"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">
                        ₹{purchase.price.toLocaleString()}
                      </span>
                      {purchase.paymentStatus === "paid" ? (
                        <span className="text-green-600 font-medium text-sm">
                          Paid
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          disabled
                          className="gradient-cta text-white text-xs h-7 opacity-60"
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <StatusIcon status={purchase.deliveryStatus} type="dot" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

          <AuthButton variant="primary" onClick={handleCustomSubmit}>
            Submit Request
          </AuthButton>
        </div>

        {/* Payment Placeholder */}
        <div className="bg-card rounded-2xl shadow-elegant p-6 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Payment (Coming Soon)
          </h3>
          <p className="text-muted-foreground mb-4">
            Razorpay payment integration will be available soon.
          </p>
          <Button disabled className="gradient-cta text-white opacity-60">
            Pay Now
          </Button>
        </div>

        {/* Logout */}
        <div className="text-center">
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
