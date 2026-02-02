import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeader from "@/components/AuthHeader";
import AuthButton from "@/components/AuthButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isValidMobile = (value: string): boolean => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    
    // Check if it's a valid Indian mobile (10 digits or 12 with 91 prefix)
    if (digits.length === 10) return true;
    if (digits.length === 12 && digits.startsWith("91")) return true;
    if (digits.length === 11 && digits.startsWith("0")) return true;
    
    return false;
  };

  const formatMobileForApi = (value: string): string => {
    let digits = value.replace(/\D/g, "");
    
    // Remove leading 0 if present
    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }
    
    // If already has 91 prefix and is 12 digits
    if (digits.startsWith("91") && digits.length === 12) {
      return "+" + digits;
    }
    
    // If 10 digits, add +91
    if (digits.length === 10) {
      return "+91" + digits;
    }
    
    return value;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!identifier) {
      setError("Email or mobile number is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    // Validate identifier (must be either valid email or valid mobile)
    const isEmail = isValidEmail(identifier);
    const isMobile = isValidMobile(identifier);

    if (!isEmail && !isMobile) {
      setError("Please enter a valid email address or 10-digit mobile number");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Format mobile number if it's a mobile login
      const loginIdentifier = isMobile ? formatMobileForApi(identifier) : identifier;
      
      const { success, error: loginError } = await login(loginIdentifier, password);
      if (success) {
        navigate("/");
      } else {
        // Provide clear error message
        if (loginError?.toLowerCase().includes("password")) {
          setError("Incorrect password. Please try again.");
        } else if (loginError?.toLowerCase().includes("user") || loginError?.toLowerCase().includes("not found")) {
          setError(isEmail ? "No account found with this email address." : "No account found with this mobile number.");
        } else {
          setError(loginError || "Invalid credentials. Please check your email/phone and password.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <AuthHeader 
          title="Welcome back 👋" 
          subtitle="Login to continue building your dream website."
        />

        <div className="bg-card rounded-2xl shadow-elegant p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Mobile Number</Label>
              <Input
                id="identifier"
                type="text"
                name="login-identifier-field"
                placeholder="Enter email or mobile number"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError("");
                }}
                className={error ? "border-destructive" : ""}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                data-lpignore="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="login-password-field"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className={error ? "border-destructive pr-10" : "pr-10"}
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                  data-lpignore="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <AuthButton type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </AuthButton>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to Vertexly's{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p className="mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;