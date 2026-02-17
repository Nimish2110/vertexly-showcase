const COUPON_CODE = "AS392212";
const COUPON_DISCOUNT = 0.7; // 70%
const COUPON_USED_KEY = "vertexly_coupon_used";

export const getCouponCode = () => COUPON_CODE;
export const getCouponDiscount = () => COUPON_DISCOUNT;

export const isCouponUsed = (userId?: string): boolean => {
  try {
    const used = JSON.parse(localStorage.getItem(COUPON_USED_KEY) || "[]");
    return used.includes(userId);
  } catch {
    return false;
  }
};

export const markCouponUsed = (userId?: string) => {
  if (!userId) return;
  try {
    const used = JSON.parse(localStorage.getItem(COUPON_USED_KEY) || "[]");
    if (!used.includes(userId)) {
      used.push(userId);
      localStorage.setItem(COUPON_USED_KEY, JSON.stringify(used));
    }
  } catch {}
};

export const validateCoupon = (code: string, userId?: string): { valid: boolean; discount: number; error?: string } => {
  if (code.toUpperCase() !== COUPON_CODE) {
    return { valid: false, discount: 0, error: "Invalid coupon code" };
  }
  if (isCouponUsed(userId)) {
    return { valid: false, discount: 0, error: "Coupon already used on your account" };
  }
  return { valid: true, discount: COUPON_DISCOUNT };
};
