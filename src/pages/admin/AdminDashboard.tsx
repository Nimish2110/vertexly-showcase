import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Clock, Loader2, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, purchases } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      navigate("/");
    }
  }, [isLoggedIn, isAdmin, navigate]);

  const stats = {
    total: purchases.length,
    pending: purchases.filter(
      (p) => p.developerStatus === "pending" || p.developerStatus === "requirements_submitted"
    ).length,
    inProgress: purchases.filter((p) => p.developerStatus === "in_progress" || p.developerStatus === "accepted").length,
    completed: purchases.filter((p) => p.developerStatus === "completed").length,
  };

  const statCards = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: ShoppingCart,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Approvals",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Loader2,
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
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              {purchases.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">{order.templateName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.selectedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">₹{order.price}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.developerStatus === "completed"
                          ? "bg-green-500/10 text-green-500"
                          : order.developerStatus === "in_progress"
                          ? "bg-blue-500/10 text-blue-500"
                          : order.developerStatus === "accepted"
                          ? "bg-purple-500/10 text-purple-500"
                          : order.developerStatus === "rejected"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {order.developerStatus.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
