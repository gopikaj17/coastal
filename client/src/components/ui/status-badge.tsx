import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "safe" | "caution" | "unsafe";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StatusBadge = ({ status, size = "md", className }: StatusBadgeProps) => {
  // Map status to icons
  const statusIcons = {
    safe: "fas fa-check-circle",
    caution: "fas fa-exclamation-triangle",
    unsafe: "fas fa-times-circle"
  };
  
  // Map status to text
  const statusText = {
    safe: "Safe",
    caution: "Caution",
    unsafe: "Unsafe"
  };
  
  // Map size to classes
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  return (
    <div 
      className={cn(
        `flex items-center bg-${status}/10 text-${status} ${sizeClasses[size]} rounded-full font-medium`,
        className
      )}
    >
      <i className={`${statusIcons[status]} mr-1`}></i>
      {statusText[status]}
    </div>
  );
};
