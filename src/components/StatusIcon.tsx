import { Check, X, Clock, Circle, CreditCard, Loader } from "lucide-react";

interface StatusIconProps {
  status?: string;
  type?: "dot" | "icon";
}

const StatusIcon = ({ status = "pending", type = "dot" }: StatusIconProps) => {
  const colorMap: Record<string, string> = {
    pending: "bg-yellow-400",
    requirements_submitted: "bg-blue-500",
    accepted: "bg-purple-500",
    rejected: "bg-red-500",
    paid: "bg-green-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
    in_progress: "bg-blue-400",
    completed: "bg-green-500",
  };

  if (type === "icon") {
    // Completed - green check
    if (status === "completed" || status === "paid" || status === "delivered") {
      return (
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      );
    }
    // Accepted - purple with credit card (awaiting payment)
    if (status === "accepted") {
      return (
        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
          <CreditCard className="w-3.5 h-3.5 text-white" />
        </div>
      );
    }
    // Rejected/Cancelled - red X
    if (status === "rejected" || status === "cancelled") {
      return (
        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
          <X className="w-4 h-4 text-white" />
        </div>
      );
    }
    // Requirements submitted - blue circle
    if (status === "requirements_submitted") {
      return (
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
          <Circle className="w-3 h-3 text-white fill-white" />
        </div>
      );
    }
    // In progress - blue with loader
    if (status === "in_progress") {
      return (
        <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center">
          <Loader className="w-4 h-4 text-white" />
        </div>
      );
    }
    // Pending - yellow with clock
    return (
      <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
        <Clock className="w-4 h-4 text-white" />
      </div>
    );
  }

  return <div className={`w-3 h-3 rounded-full ${colorMap[status] || colorMap.pending}`} />;
};

export default StatusIcon;