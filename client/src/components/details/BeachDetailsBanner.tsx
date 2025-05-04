import { BeachWithDetails } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";

interface BeachDetailsBannerProps {
  beach: BeachWithDetails;
}

const BeachDetailsBanner = ({ beach }: BeachDetailsBannerProps) => {
  // Get the most recent condition data
  const condition = beach.conditions[0];
  
  // Return null if no condition data available (should never happen)
  if (!condition) return null;
  
  return (
    <div className="relative rounded-xl overflow-hidden mb-4 h-48">
      {/* Use the beach image or a fallback */}
      <img 
        src={beach.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} 
        alt={beach.name} 
        className="w-full h-full object-cover"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
        <div className="p-4 text-white">
          <h1 className="text-2xl font-bold mb-1">{beach.name}</h1>
          <p className="flex items-center">
            <i className="fas fa-map-marker-alt mr-2"></i>
            <span>{beach.location}</span>
          </p>
        </div>
      </div>
      
      {/* Safety status badge */}
      <div className="absolute top-4 right-4">
        <StatusBadge 
          status={condition.safetyStatus as "safe" | "caution" | "unsafe"} 
          size="lg"
        />
      </div>
    </div>
  );
};

export default BeachDetailsBanner;
