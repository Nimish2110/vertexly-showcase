import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, Purchase } from "@/contexts/AuthContext";
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
import { MoreHorizontal, Eye, Check, X, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const AdminOrders = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, purchases, updateOrderStatus } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      navigate("/");
    }
  }, [isLoggedIn, isAdmin, navigate]);

  const handleStatusChange = (orderId: string, status: Purchase["developerStatus"]) => {
    updateOrderStatus(orderId, status);
    toast.success(`Order status updated to ${status.replace("_", " ")}`);
  };

  const getStatusBadge = (status: Purchase["developerStatus"]) => {
    const styles = {
      pending: "bg-yellow-500/10 text-yellow-500",
      requirements_submitted: "bg-orange-500/10 text-orange-500",
      accepted: "bg-purple-500/10 text-purple-500",
      rejected: "bg-red-500/10 text-red-500",
      in_progress: "bg-blue-500/10 text-blue-500",
      completed: "bg-green-500/10 text-green-500",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all customer orders
          </p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
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
                {purchases.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">#{order.id}</TableCell>
                    <TableCell className="font-medium">{order.templateName}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {order.requirements}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.selectedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>₹{order.price}</TableCell>
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
                            <Link to={`/admin/orders/${order.id}`} className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, "accepted")}
                            className="flex items-center gap-2 text-green-500"
                          >
                            <Check className="w-4 h-4" />
                            Accept
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, "rejected")}
                            className="flex items-center gap-2 text-red-500"
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, "in_progress")}
                            className="flex items-center gap-2 text-blue-500"
                          >
                            <Loader2 className="w-4 h-4" />
                            Mark In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, "completed")}
                            className="flex items-center gap-2 text-green-500"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
