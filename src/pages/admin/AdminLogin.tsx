import { useState, FormEvent, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@/lib/api";
import AuthHeader from "@/components/AuthHeader";
import AuthButton from "@/components/AuthButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("vertexly.in@gmail.com");
  const [password, setPassword] = useState("shivapal123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Remove readonly after mount to prevent autofill
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const result = await loginUser(email, password);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      // Check if user is admin
      if (result.data?.user?.role !== "admin") {
        setError("Access denied. Admin only.");
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <AuthHeader
            title="Admin Login"
            subtitle="Access the Vertexly admin dashboard"
          />
        </div>

        <div className="bg-card rounded-2xl shadow-elegant p-8">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                ref={emailRef}
                id="admin-email"
                name="admin-email-field"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className={error ? "border-destructive" : ""}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                data-lpignore="true"
                readOnly={!isReady}
                onFocus={() => {
                  if (emailRef.current) {
                    emailRef.current.removeAttribute("readonly");
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                ref={passwordRef}
                id="admin-password"
                name="admin-password-field"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className={error ? "border-destructive" : ""}
                autoComplete="new-password"
                data-form-type="other"
                data-lpignore="true"
                readOnly={!isReady}
                onFocus={() => {
                  if (passwordRef.current) {
                    passwordRef.current.removeAttribute("readonly");
                  }
                }}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <AuthButton type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In as Admin"}
            </AuthButton>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;