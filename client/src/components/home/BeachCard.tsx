import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BeachWithCondition } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDistance } from "@/lib/utils";

interface BeachCardProps {
  beach: BeachWithCondition;
}

const BeachCard = ({ beach }: BeachCardProps) => {
  // Get the most recent condition data
  const condition = beach.conditions[0];
  
  // Return null if no condition data available (should never happen)
  if (!condition) return null;
  
  // Get the safety status
  const safetyStatus = condition.safetyStatus.toLowerCase();
  
  return (
    <div className={`bg-white rounded-lg shadow-md mb-3 overflow-hidden border-status-${safetyStatus}`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{beach.name}</h3>
            <p className="text-neutral-600 text-sm mb-1">
              <i className="fas fa-map-marker-alt mr-1"></i>
              {formatDistance(beach.distance)}
            </p>
          </div>
          <StatusBadge status={safetyStatus as "safe" | "caution" | "unsafe"} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          <div className="flex items-center">
            <i className="fas fa-temperature-high text-neutral-500 mr-2"></i>
            <div>
              <p className="text-sm text-neutral-500">Temperature</p>
              <p className="font-medium">{condition.temperature}°C</p>
            </div>
          </div>
          <div className="flex items-center">
            <i className={`fas fa-water ${Number(condition.waveHeight) > 1.5 ? 'text-caution' : 'text-neutral-500'} mr-2`}></i>
            <div>
              <p className="text-sm text-neutral-500">Wave Height</p>
              <p className="font-medium">{condition.waveHeight}m</p>
            </div>
          </div>
          <div className="flex items-center">
            <i className={`fas fa-wind ${Number(condition.windSpeed) > 30 ? 'text-unsafe' : Number(condition.windSpeed) > 20 ? 'text-caution' : 'text-neutral-500'} mr-2`}></i>
            <div>
              <p className="text-sm text-neutral-500">Wind Speed</p>
              <p className="font-medium">{condition.windSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center">
            <i className="fas fa-tint text-neutral-500 mr-2"></i>
            <div>
              <p className="text-sm text-neutral-500">Water Quality</p>
              <p className={`font-medium ${condition.waterQuality === 'good' ? 'text-safe' : condition.waterQuality === 'moderate' ? 'text-caution' : 'text-unsafe'}`}>
                {condition.waterQuality.charAt(0).toUpperCase() + condition.waterQuality.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {beach.hazards.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {beach.hazards.slice(0, 3).map((hazard) => (
              <span 
                key={hazard.id}
                className={`${hazard.severity === 'high' ? 'bg-unsafe/10 text-unsafe' : hazard.severity === 'moderate' ? 'bg-caution/10 text-caution' : 'bg-neutral-100 text-neutral-700'} px-2 py-1 rounded-full text-xs flex items-center`}
              >
                <i className={`${hazard.icon} mr-1`}></i>
                {hazard.description.split('–')[0]}
              </span>
            ))}
            
            {beach.hazards.length > 3 && (
              <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs flex items-center">
                +{beach.hazards.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <Link href="/map">
            <Button variant="secondary" size="sm" className="mr-2">
              <i className="fas fa-map-marker-alt mr-1"></i>
              Map
            </Button>
          </Link>
          <Link href={`/beach/${beach.id}`}>
            <Button size="sm">
              <i className="fas fa-info-circle mr-1"></i>
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BeachCard;
