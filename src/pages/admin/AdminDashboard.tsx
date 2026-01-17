import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { adminGetOrders, Order } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Clock, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isLoggedIn || !isAdmin())) {
      navigate("/admin");
    }
  }, [isLoggedIn, isAdmin, authLoading, navigate]);

  const fetchOrders = async () => {
    if (!isLoggedIn || !isAdmin()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await adminGetOrders();
      
      if (apiError) {
        console.error("Failed to fetch admin orders:", apiError);
        setError(apiError);
        setOrders([]);
      } else if (data && Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Invalid response format from admin orders API");
        setError("Invalid response format from server");
        setOrders([]);
      }
    } catch (err) {
      console.error("Unexpected error fetching admin orders:", err);
      setError("An unexpected error occurred");
      setOrders([]);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [isLoggedIn, isAdmin]);

  // Only calculate stats when we have valid data and no error
  const stats = error ? null : {
    total: orders.length,
    inProgress: orders.filter((o) => 
      o?.developerStatus === "in_progress" || 
      o?.developerStatus === "accepted" ||
      o?.developerStatus === "requirements_submitted"
    ).length,
    completed: orders.filter((o) => o?.developerStatus === "completed").length,
  };

  const statCards = stats ? [
    {
      title: "Total Orders",
      value: stats.total,
      icon: ShoppingCart,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ] : [];

  if (authLoading || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your orders.
            </p>
          </div>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error loading dashboard data</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={fetchOrders}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Orders Preview */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">{order?.templateName || "Unknown Template"}</p>
                    <p className="text-sm text-muted-foreground">
                      {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">₹{order?.price || order?.totalPrice || 0}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order?.developerStatus === "completed"
                          ? "bg-green-500/10 text-green-500"
                          : order?.developerStatus === "in_progress"
                          ? "bg-blue-500/10 text-blue-500"
                          : order?.developerStatus === "accepted"
                          ? "bg-purple-500/10 text-purple-500"
                          : order?.developerStatus === "rejected"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {(order?.developerStatus ?? "unknown").replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;