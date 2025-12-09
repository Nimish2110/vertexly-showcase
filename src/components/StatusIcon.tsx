import { Check, X, Clock, Circle } from "lucide-react";

interface StatusIconProps {
  status: "pending" | "requirements_submitted" | "accepted" | "rejected" | "paid" | "delivered" | "cancelled" | "in_progress" | "completed";
  type?: "dot" | "icon";
}

const StatusIcon = ({ status, type = "dot" }: StatusIconProps) => {
  const colorMap: Record<string, string> = {
    pending: "bg-yellow-400",
    requirements_submitted: "bg-blue-500",
    accepted: "bg-green-500",
    rejected: "bg-red-500",
    paid: "bg-green-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
    in_progress: "bg-yellow-400",
    completed: "bg-green-500",
  };

  if (type === "icon") {
    if (status === "accepted" || status === "paid" || status === "delivered" || status === "completed") {
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
    if (status === "requirements_submitted") {
      return (
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
          <Circle className="w-3 h-3 text-white fill-white" />
        </div>
      );
    }
    if (status === "in_progress") {
      return (
        <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
          <Clock className="w-4 h-4 text-white" />
        </div>
      );
    }
    // pending
    return (
      <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>
    );
  }

  return <div className={`w-3 h-3 rounded-full ${colorMap[status] || colorMap.pending}`} />;
};

export default StatusIcon;
