import { useState } from "react";
import { X, Copy, Check, PartyPopper, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCouponCode } from "@/lib/coupon";
import { useToast } from "@/hooks/use-toast";

interface CouponPopupProps {
  onClose: () => void;
}

const CouponPopup = ({ onClose }: CouponPopupProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const code = getCouponCode();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ title: "Copied!", description: "Coupon code copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Please copy manually.", variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup card */}
      <div className="relative z-10 w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration header */}
        <div className="gradient-primary px-6 py-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {/* Decorative dots */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary-foreground rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <PartyPopper className="w-8 h-8 text-primary-foreground" />
              <Gift className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
              🎉 Congratulations!
            </h2>
            <p className="text-primary-foreground/90 text-sm">
              Welcome to Vertexly
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-center space-y-5">
          <div>
            <p className="text-lg font-semibold text-foreground">
              Get <span className="text-primary text-2xl font-bold">70% OFF</span>
            </p>
            <p className="text-muted-foreground text-sm">on your first order</p>
          </div>

          {/* Coupon code */}
          <div className="flex items-center justify-center gap-2">
            <div className="bg-muted border-2 border-dashed border-primary/40 rounded-lg px-5 py-3">
              <span className="text-xl font-mono font-bold tracking-widest text-foreground">
                {code}
              </span>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Apply this code at checkout. Valid for first order only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CouponPopup;
