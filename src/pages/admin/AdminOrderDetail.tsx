import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, Purchase } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Check,
  X,
  Loader2,
  CheckCircle,
  Upload,
  FileArchive,
} from "lucide-react";
import { toast } from "sonner";

const AdminOrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { isLoggedIn, isAdmin, purchases, updateOrderStatus, updateOrderDownloadLink } = useAuth();
  const [downloadLink, setDownloadLink] = useState("");

  const order = purchases.find((p) => p.id === orderId);

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      navigate("/");
    }
  }, [isLoggedIn, isAdmin, navigate]);

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Order not found</p>
          <Button variant="outline" onClick={() => navigate("/admin/orders")} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const handleStatusChange = (status: Purchase["developerStatus"]) => {
    updateOrderStatus(order.id, status);
    toast.success(`Order status updated to ${status.replace("_", " ")}`);
  };

  const handleUploadLink = () => {
    if (!downloadLink) {
      toast.error("Please enter a download link");
      return;
    }
    updateOrderDownloadLink(order.id, downloadLink);
    toast.success("Download link added successfully");
  };

  const statusTimeline = [
    { status: "pending", label: "Order Placed", active: true },
    {
      status: "requirements_submitted",
      label: "Requirements Submitted",
      active: ["requirements_submitted", "accepted", "in_progress", "completed"].includes(
        order.developerStatus
      ),
    },
    {
      status: "accepted",
      label: "Accepted",
      active: ["accepted", "in_progress", "completed"].includes(order.developerStatus),
    },
    {
      status: "in_progress",
      label: "In Progress",
      active: ["in_progress", "completed"].includes(order.developerStatus),
    },
    {
      status: "completed",
      label: "Completed",
      active: order.developerStatus === "completed",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/orders")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Order #{order.id}</h1>
            <p className="text-muted-foreground">{order.templateName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Template</p>
                    <p className="font-medium">{order.templateName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">₹{order.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.selectedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        order.paymentStatus === "paid"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground whitespace-pre-wrap">{order.requirements}</p>
                </div>
                {order.isCustom && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Website Type</p>
                      <p className="font-medium">{order.websiteType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Business Type</p>
                      <p className="font-medium">{order.businessType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Time</p>
                      <p className="font-medium">{order.deliveryTime}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* File Upload for Completed Projects */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileArchive className="w-5 h-5" />
                  Upload Final Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="downloadLink">Download Link (ZIP file URL)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="downloadLink"
                      placeholder="https://drive.google.com/..."
                      value={downloadLink}
                      onChange={(e) => setDownloadLink(e.target.value)}
                    />
                    <Button onClick={handleUploadLink}>
                      <Upload className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
                {order.downloadLink && (
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <p className="text-sm text-green-500">
                      ✓ Download link saved: {order.downloadLink}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Status & Actions */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusTimeline.map((step, index) => (
                    <div key={step.status} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`text-sm ${
                          step.active ? "text-foreground font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusChange("accepted")}
                >
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Accept Order
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusChange("rejected")}
                >
                  <X className="w-4 h-4 mr-2 text-red-500" />
                  Reject Order
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusChange("in_progress")}
                >
                  <Loader2 className="w-4 h-4 mr-2 text-blue-500" />
                  Mark In Progress
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusChange("completed")}
                >
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Mark Completed
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetail;
