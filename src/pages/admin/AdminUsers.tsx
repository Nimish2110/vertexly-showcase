import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { adminGetUsers, adminDeleteUser, adminRestoreUser, User } from "@/lib/api";
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
import { Trash2, RotateCcw, UserCircle, Loader2, AlertCircle, RefreshCw, Users } from "lucide-react";
import { toast } from "sonner";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isLoggedIn || !isAdmin())) {
      navigate("/admin");
    }
  }, [isLoggedIn, isAdmin, authLoading, navigate]);

  const fetchUsers = async () => {
    if (!isLoggedIn || !isAdmin()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await adminGetUsers();
      
      if (apiError) {
        console.error("Failed to fetch users:", apiError);
        setError(apiError);
        setUsers([]);
      } else if (data && Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Invalid response format from users API");
        setError("Invalid response format from server");
        setUsers([]);
      }
    } catch (err) {
      console.error("Unexpected error fetching users:", err);
      setError("An unexpected error occurred");
      setUsers([]);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [isLoggedIn, isAdmin]);

  const handleSoftDelete = async (userId: string) => {
    const { data, error } = await adminDeleteUser(userId);
    if (data && !error) {
      setUsers((prev) =>
        prev.map((u) => (u?._id === userId ? { ...u, status: "deleted" } : u))
      );
      toast.success("User has been soft deleted");
    } else {
      toast.error(error || "Failed to delete user");
    }
  };

  const handleRestore = async (userId: string) => {
    const { data, error } = await adminRestoreUser(userId);
    if (data && !error) {
      setUsers((prev) =>
        prev.map((u) => (u?._id === userId ? { ...u, status: "active" } : u))
      );
      toast.success("User has been restored");
    } else {
      toast.error(error || "Failed to restore user");
    }
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

  // Error state with retry button
  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all registered users
            </p>
          </div>
          
          <Card className="border-border">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Failed to Load Users
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {error}
              </p>
              <Button onClick={fetchUsers} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  // Safe array operations with defensive checks
  const safeUsers = Array.isArray(users) ? users : [];
  const activeUsers = safeUsers.filter((u) => u?.status === "active").length;
  const deletedUsers = safeUsers.filter((u) => u?.status === "deleted").length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all registered users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{safeUsers.length}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{activeUsers}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Deleted Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{deletedUsers}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {safeUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Users Found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  There are no registered users yet. Users will appear here once they sign up.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeUsers.map((user) => (
                    <TableRow 
                      key={user?._id || Math.random().toString()} 
                      className={user?.status === "deleted" ? "opacity-50" : ""}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCircle className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{user?.name || "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user?.email || "—"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            user?.role === "admin"
                              ? "bg-purple-500/10 text-purple-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {user?.role || "user"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            user?.status === "active"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {user?.status || "active"}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {user?.role !== "admin" && user?._id && (
                          <>
                            {user?.status !== "deleted" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSoftDelete(user._id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRestore(user._id)}
                                className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
