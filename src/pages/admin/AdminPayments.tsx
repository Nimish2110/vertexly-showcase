import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { adminGetOrders, Order } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, AlertTriangle, IndianRupee, TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface PaymentRecord {
  orderId: string;
  userName: string;
  userEmail: string;
  templateName: string;
  amount: number;
  paymentStatus: string;
  paidAt: string;
}

const AdminPayments = () => {
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

  // Filter paid orders and calculate payments
  const paidOrders = orders.filter((o) => o?.paymentStatus === "paid");
  
  const payments: PaymentRecord[] = paidOrders.map((order) => {
    const user = typeof order?.user === "object" ? order.user : null;
    return {
      orderId: order._id,
      userName: user?.name || "N/A",
      userEmail: user?.email || "N/A",
      templateName: order?.templateName || "Unknown Template",
      amount: order?.totalPrice || order?.price || 0,
      paymentStatus: order?.paymentStatus || "unpaid",
      paidAt: order?.updatedAt || order?.createdAt || "",
    };
  });

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

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
            <h1 className="text-3xl font-bold text-foreground">Payments</h1>
            <p className="text-muted-foreground mt-1">
              View all payment transactions
            </p>
          </div>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error loading payments</AlertTitle>
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
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">
            View all payment transactions and revenue
          </p>
        </div>

        {/* Total Revenue Card */}
        <Card className="border-border bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1">
              <IndianRupee className="w-6 h-6 text-foreground" />
              <span className="text-3xl font-bold text-foreground">
                {totalRevenue.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              From {payments.length} successful payment{payments.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Payment History ({payments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.orderId}>
                    <TableCell className="font-medium">
                      {payment.userName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.userEmail}
                    </TableCell>
                    <TableCell>{payment.templateName}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-0.5 font-medium text-green-600">
                        <IndianRupee className="w-3 h-3" />
                        {payment.amount.toLocaleString("en-IN")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-500 font-medium">
                        {payment.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.paidAt
                        ? format(new Date(payment.paidAt), "dd MMM yyyy, hh:mm a")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No payments received yet
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

export default AdminPayments;
