import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { adminGetOrders, adminUpdateOrderStatus, adminUploadDelivery, Order } from "@/lib/api";
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
  const { isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && (!isLoggedIn || !isAdmin())) {
      navigate("/admin");
    }
  }, [isLoggedIn, isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isLoggedIn || !isAdmin() || !orderId) return;
      
      setIsLoading(true);
      const { data, error } = await adminGetOrders();
      if (data && !error) {
        const foundOrder = data.find((o) => o._id === orderId);
        setOrder(foundOrder || null);
      }
      setIsLoading(false);
    };
    fetchOrder();
  }, [isLoggedIn, isAdmin, orderId]);

  if (authLoading || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

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

  const handleStatusChange = async (status: Order["developerStatus"]) => {
    const { data, error } = await adminUpdateOrderStatus(order._id, status);
    if (data && !error) {
      setOrder({ ...order, developerStatus: status });
      toast.success(`Order status updated to ${status.replace("_", " ")}`);
    } else {
      toast.error(error || "Failed to update status");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".zip")) {
      toast.error("Please upload a ZIP file");
      return;
    }

    setIsUploading(true);
    const { data, error } = await adminUploadDelivery(order._id, file);
    if (data && !error) {
      setOrder({ ...order, downloadLink: data.downloadLink });
      toast.success("File uploaded successfully");
    } else {
      toast.error(error || "Failed to upload file");
    }
    setIsUploading(false);
  };

  const user = typeof order.user === "object" ? order.user : null;

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
            <h1 className="text-3xl font-bold text-foreground">
              Order #{order._id.slice(-6)}
            </h1>
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
                      {new Date(order.createdAt).toLocaleDateString()}
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
                  {user && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Customer Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Customer Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground whitespace-pre-wrap">
                    {order.requirements || "No requirements submitted yet"}
                  </p>
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
                  <Label htmlFor="fileUpload">Upload ZIP File</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fileUpload"
                      type="file"
                      accept=".zip"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </div>
                {order.downloadLink && (
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <p className="text-sm text-green-500">
                      ✓ File uploaded successfully
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
