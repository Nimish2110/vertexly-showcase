import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { adminGetOrders, adminAcceptOrder, adminUpdateOrderStatus, Order } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { MoreHorizontal, Eye, Check, X, Loader2, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const AdminOrders = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isLoggedIn || !isAdmin())) {
      navigate("/admin");
    }
  }, [isLoggedIn, isAdmin, authLoading, navigate]);

  const fetchOrders = async () => {
    if (!isLoggedIn || !isAdmin()) return;
    
    setIsLoading(true);
    const { data, error } = await adminGetOrders();
    if (data && !error) {
      setOrders(data);
    } else if (error) {
      toast.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [isLoggedIn, isAdmin]);

  const handleAcceptOrder = async (orderId: string) => {
    setAcceptingOrderId(orderId);
    const { data, error } = await adminAcceptOrder(orderId);
    if (data && !error) {
      // Refetch orders to sync state with backend
      await fetchOrders();
      toast.success("Order accepted successfully!");
    } else {
      toast.error(error || "Failed to accept order");
    }
    setAcceptingOrderId(null);
  };

  const handleStatusChange = async (orderId: string, status: Order["developerStatus"]) => {
    const { data, error } = await adminUpdateOrderStatus(orderId, status);
    if (data && !error) {
      // Refetch orders to sync state with backend
      await fetchOrders();
      toast.success(`Order status updated to ${status.replace("_", " ")}`);
    } else {
      toast.error(error || "Failed to update status");
    }
  };

  const getStatusBadge = (status: Order["developerStatus"]) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500",
      requirements_submitted: "bg-orange-500/10 text-orange-500",
      accepted: "bg-purple-500/10 text-purple-500",
      rejected: "bg-red-500/10 text-red-500",
      in_progress: "bg-blue-500/10 text-blue-500",
      completed: "bg-green-500/10 text-green-500",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status || "pending"]}`}>
        {(status || "pending").replace("_", " ")}
      </span>
    );
  };

  // Filter orders by status
  const pendingApprovalOrders = orders.filter(
    (o) => o.developerStatus === "requirements_submitted"
  );
  const allOtherOrders = orders.filter(
    (o) => o.developerStatus !== "requirements_submitted"
  );

  if (authLoading || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
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

        {/* Pending Approvals Section */}
        <Card className="border-border border-orange-500/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <CardTitle>Pending Approvals</CardTitle>
            </div>
            <CardDescription>
              Orders awaiting your review and acceptance ({pendingApprovalOrders.length} orders)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingApprovalOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No orders pending approval
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Requirements</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovalOrders.map((order) => {
                    const user = typeof order.user === "object" ? order.user : null;
                    return (
                      <TableRow key={order._id}>
                        <TableCell className="font-mono text-sm">
                          #{order._id.slice(-6)}
                        </TableCell>
                        <TableCell>
                          {user ? (
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{order.templateName}</TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="truncate text-muted-foreground" title={order.requirements}>
                            {order.requirements || "Not submitted"}
                          </p>
                        </TableCell>
                        <TableCell>₹{order.totalPrice || order.price || 0}</TableCell>
                        <TableCell>{getStatusBadge(order.developerStatus)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptOrder(order._id)}
                              disabled={acceptingOrderId === order._id}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {acceptingOrderId === order._id ? (
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
                              onClick={() => handleStatusChange(order._id, "rejected")}
                              className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/admin/orders/${order._id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* All Orders Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
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
                {allOtherOrders.map((order) => {
                  const user = typeof order.user === "object" ? order.user : null;
                  return (
                    <TableRow key={order._id}>
                      <TableCell className="font-mono text-sm">
                        #{order._id.slice(-6)}
                      </TableCell>
                      <TableCell>
                        {user ? (
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{order.templateName}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {order.requirements || "Not submitted"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>₹{order.totalPrice || order.price || 0}</TableCell>
                      <TableCell>{getStatusBadge(order.developerStatus)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            order.paymentStatus === "paid"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/orders/${order._id}`} className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order._id, "accepted")}
                              className="flex items-center gap-2 text-green-500"
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order._id, "rejected")}
                              className="flex items-center gap-2 text-red-500"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order._id, "in_progress")}
                              className="flex items-center gap-2 text-blue-500"
                            >
                              <Loader2 className="w-4 h-4" />
                              Mark In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(order._id, "completed")}
                              className="flex items-center gap-2 text-green-500"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {allOtherOrders.length === 0 && (
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
