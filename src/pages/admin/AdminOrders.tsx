import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { adminGetOrders, adminAcceptOrder, adminUpdateOrderStatus, Order } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Check, X, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminOrders = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);

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

  const handleAcceptOrder = async (orderId: string) => {
    setAcceptingOrderId(orderId);
    try {
      const { data, error } = await adminAcceptOrder(orderId);
      if (data && !error) {
        // Refetch orders to sync state with backend
        await fetchOrders();
        toast.success("Order accepted successfully!");
      } else {
        toast.error(error || "Failed to accept order");
      }
    } catch (err) {
      console.error("Error accepting order:", err);
      toast.error("Failed to accept order");
    }
    setAcceptingOrderId(null);
  };

  const handleStatusChange = async (orderId: string, status: Order["developerStatus"]) => {
    try {
      const { data, error } = await adminUpdateOrderStatus(orderId, status || "pending");
      if (data && !error) {
        // Refetch orders to sync state with backend
        await fetchOrders();
        toast.success(`Order status updated to ${(status || "pending").replace(/_/g, " ")}`);
      } else {
        toast.error(error || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: Order["developerStatus"]) => {
    const safeStatus = status || "pending";
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500",
      requirements_submitted: "bg-orange-500/10 text-orange-500",
      accepted: "bg-purple-500/10 text-purple-500",
      rejected: "bg-red-500/10 text-red-500",
      in_progress: "bg-blue-500/10 text-blue-500",
      completed: "bg-green-500/10 text-green-500",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[safeStatus] || styles.pending}`}>
        {safeStatus.replace(/_/g, " ")}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string | undefined) => {
    const safeStatus = paymentStatus || "unpaid";
    return (
      <span
        className={`px-2 py-1 rounded text-xs ${
          safeStatus === "paid"
            ? "bg-green-500/10 text-green-500"
            : "bg-yellow-500/10 text-yellow-500"
        }`}
      >
        {safeStatus}
      </span>
    );
  };

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
            <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all customer orders
            </p>
          </div>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error loading orders</AlertTitle>
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
          <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all customer orders
          </p>
        </div>

        {/* All Orders Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>All Orders ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Requirements</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const user = typeof order?.user === "object" ? order.user : null;
                  const orderId = order?._id || "";
                  const templateName = order?.templateName || "Unknown Template";
                  const requirements = order?.requirements || "Not submitted";
                  const createdAt = order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A";
                  const price = order?.totalPrice || order?.price || 0;
                  const developerStatus = order?.developerStatus;
                  const paymentStatus = order?.paymentStatus;
                  
                  return (
                    <TableRow key={orderId}>
                      <TableCell className="font-mono text-sm">
                        #{orderId.slice(-6)}
                      </TableCell>
                      <TableCell>
                        {user ? (
                          <div>
                            <p className="font-medium">{user.name || "N/A"}</p>
                            <p className="text-xs text-muted-foreground">{user.email || "N/A"}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{templateName}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {requirements}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {createdAt}
                      </TableCell>
                      <TableCell>₹{price}</TableCell>
                      <TableCell>{getStatusBadge(developerStatus)}</TableCell>
                      <TableCell>{getPaymentBadge(paymentStatus)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {developerStatus === "requirements_submitted" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAcceptOrder(orderId)}
                                disabled={acceptingOrderId === orderId}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {acceptingOrderId === orderId ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Check className="w-4 h-4 mr-1" />
                                    Accept
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(orderId, "rejected")}
                                className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/orders/${orderId}`} className="flex items-center gap-2">
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              {developerStatus !== "accepted" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(orderId, "accepted")}
                                  className="flex items-center gap-2 text-green-500"
                                >
                                  <Check className="w-4 h-4" />
                                  Accept
                                </DropdownMenuItem>
                              )}
                              {developerStatus !== "rejected" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(orderId, "rejected")}
                                  className="flex items-center gap-2 text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                  Reject
                                </DropdownMenuItem>
                              )}
                              {developerStatus !== "in_progress" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(orderId, "in_progress")}
                                  className="flex items-center gap-2 text-blue-500"
                                >
                                  <Loader2 className="w-4 h-4" />
                                  Mark In Progress
                                </DropdownMenuItem>
                              )}
                              {developerStatus !== "completed" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(orderId, "completed")}
                                  className="flex items-center gap-2 text-green-500"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Mark Completed
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;