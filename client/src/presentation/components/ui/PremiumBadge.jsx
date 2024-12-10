import React from "react";
import { Star } from "lucide-react";

const PremiumBadge = ({ className = "" }) => {
  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md ${className}`}
    >
      <Star className="w-4 h-4 mr-1" />
      Premium
    </div>
  );
};

export default PremiumBadge;
