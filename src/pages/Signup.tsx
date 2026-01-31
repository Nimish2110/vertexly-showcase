import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeader from "@/components/AuthHeader";
import AuthButton from "@/components/AuthButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", mobile: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const formatMobileNumber = (value: string): string => {
    // Remove all non-digit characters except +
    let cleaned = value.replace(/[^\d+]/g, "");
    
    // If starts with +, keep it, otherwise allow digits only
    if (cleaned.startsWith("+")) {
      cleaned = "+" + cleaned.slice(1).replace(/\D/g, "");
    } else {
      cleaned = cleaned.replace(/\D/g, "");
    }
    
    return cleaned;
  };

  const validateMobile = (value: string): boolean => {
    if (!value) return true; // Mobile is optional
    
    // Remove country code for validation
    let digits = value.replace(/\D/g, "");
    
    // If starts with 91 and has more than 10 digits, remove 91
    if (digits.startsWith("91") && digits.length > 10) {
      digits = digits.slice(2);
    }
    
    // Should be exactly 10 digits
    return digits.length === 10;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors = { name: "", email: "", mobile: "", password: "" };

    if (!name) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (mobile && !validateMobile(mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    setApiError("");

    if (!newErrors.name && !newErrors.email && !newErrors.mobile && !newErrors.password) {
      setIsLoading(true);
      try {
        // Format mobile number with +91 if provided without country code
        let formattedMobile = "";
        if (mobile) {
          let digits = mobile.replace(/\D/g, "");
          if (digits.startsWith("91") && digits.length > 10) {
            formattedMobile = "+" + digits;
          } else if (digits.length === 10) {
            formattedMobile = "+91" + digits;
          } else {
            formattedMobile = mobile.startsWith("+") ? mobile : "+91" + digits;
          }
        }
        
        const { success, error } = await register(name, email, password, formattedMobile || undefined);
        if (success) {
          navigate("/");
        } else {
          setApiError(error || "Registration failed");
        }
      } catch (err) {
        setApiError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <AuthHeader 
          title="Welcome to Vertexly 💜" 
          subtitle="Create your account and launch your vision in minutes."
        />

        <div className="bg-card rounded-2xl shadow-elegant p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                name="signup-name-field"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: "" });
                }}
                className={errors.name ? "border-destructive" : ""}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                data-lpignore="true"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                name="signup-email-field"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                className={errors.email ? "border-destructive" : ""}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                data-lpignore="true"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input
                id="mobile"
                type="tel"
                name="signup-mobile-field"
                placeholder="Enter mobile number (e.g., 9876543210)"
                value={mobile}
                onChange={(e) => {
                  setMobile(formatMobileNumber(e.target.value));
                  setErrors({ ...errors, mobile: "" });
                }}
                className={errors.mobile ? "border-destructive" : ""}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                data-lpignore="true"
              />
              <p className="text-xs text-muted-foreground">Country code optional, defaults to +91</p>
              {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="signup-password-field"
                placeholder="Create password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className={errors.password ? "border-destructive" : ""}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                data-lpignore="true"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            {apiError && <p className="text-sm text-destructive">{apiError}</p>}

            <AuthButton type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </AuthButton>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{" "}
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
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Login
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

export default Signup;
