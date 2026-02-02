import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeader from "@/components/AuthHeader";
import AuthButton from "@/components/AuthButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", phone: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const formatPhoneNumber = (value: string): string => {
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

  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isValidPhone = (value: string): boolean => {
    if (!value) return false;
    
    // Remove country code for validation
    let digits = value.replace(/\D/g, "");
    
    // If starts with 91 and has more than 10 digits, remove 91
    if (digits.startsWith("91") && digits.length > 10) {
      digits = digits.slice(2);
    }
    
    // Should be exactly 10 digits
    return digits.length === 10;
  };

  const formatPhoneForApi = (value: string): string => {
    let digits = value.replace(/\D/g, "");
    
    // If starts with 91 and has more than 10 digits
    if (digits.startsWith("91") && digits.length > 10) {
      return "+" + digits;
    }
    
    // If 10 digits, add +91
    if (digits.length === 10) {
      return "+91" + digits;
    }
    
    return value.startsWith("+") ? value : "+91" + digits;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors = { name: "", email: "", phone: "", password: "", general: "" };

    if (!name) {
      newErrors.name = "Name is required";
    }

    // Either email or phone is required
    const hasEmail = email.trim().length > 0;
    const hasPhone = phone.trim().length > 0;

    if (!hasEmail && !hasPhone) {
      newErrors.general = "Please provide either an email address or mobile number";
    }

    if (hasEmail && !isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (hasPhone && !isValidPhone(phone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    setApiError("");

    const hasErrors = Object.values(newErrors).some(err => err !== "");
    
    if (!hasErrors) {
      setIsLoading(true);
      try {
        // Format phone number with +91 if provided
        const formattedPhone = hasPhone ? formatPhoneForApi(phone) : undefined;
        const formattedEmail = hasEmail ? email : undefined;
        
        const { success, error } = await register(name, password, formattedEmail, formattedPhone);
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
                  setErrors({ ...errors, name: "", general: "" });
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
              <Label htmlFor="email">Email address <span className="text-muted-foreground text-xs">(optional if phone provided)</span></Label>
              <Input
                id="email"
                type="email"
                name="signup-email-field"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "", general: "" });
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
              <Label htmlFor="phone">Mobile Number <span className="text-muted-foreground text-xs">(optional if email provided)</span></Label>
              <Input
                id="phone"
                type="tel"
                name="signup-phone-field"
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhoneNumber(e.target.value));
                  setErrors({ ...errors, phone: "", general: "" });
                }}
                className={errors.phone ? "border-destructive" : ""}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                data-lpignore="true"
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            {errors.general && <p className="text-sm text-destructive">{errors.general}</p>}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="signup-password-field"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
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
