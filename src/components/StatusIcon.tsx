import { Check, X } from "lucide-react";

interface StatusIconProps {
  status: "pending" | "accepted" | "rejected" | "paid" | "delivered" | "cancelled";
  type?: "dot" | "icon";
}

const StatusIcon = ({ status, type = "dot" }: StatusIconProps) => {
  const colorMap = {
    pending: "bg-yellow-400",
    accepted: "bg-green-500",
    rejected: "bg-red-500",
    paid: "bg-green-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };

  if (type === "icon") {
    if (status === "accepted" || status === "paid" || status === "delivered") {
      return (
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      );
    }
    if (status === "rejected" || status === "cancelled") {
      return (
        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
          <X className="w-4 h-4 text-white" />
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
    );
  }

  return <div className={`w-3 h-3 rounded-full ${colorMap[status]}`} />;
};

export default StatusIcon;
