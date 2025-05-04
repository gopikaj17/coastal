import { BeachWithDetails } from "@/types";
import { getUVInfo } from "@/lib/utils";

interface CurrentConditionsProps {
  beach: BeachWithDetails;
}

const CurrentConditions = ({ beach }: CurrentConditionsProps) => {
  // Get the most recent condition data
  const condition = beach.conditions[0];
  
  // Return null if no condition data available (should never happen)
  if (!condition) return null;
  
  // Get UV info with description and color
  const uvInfo = getUVInfo(condition.uvIndex);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-lg mb-3">Current Conditions</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Temperature */}
        <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
          <i className="fas fa-temperature-high text-2xl text-primary mb-1"></i>
          <p className="text-xs text-neutral-500">Temperature</p>
          <p className="font-semibold">{condition.temperature}°C</p>
          <p className="text-xs text-neutral-600">
            Feels like {condition.feelsLike}°C
          </p>
        </div>
        
        {/* Wave Height */}
        <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
          <i className="fas fa-water text-2xl text-primary mb-1"></i>
          <p className="text-xs text-neutral-500">Wave Height</p>
          <p className="font-semibold">{condition.waveHeight}m</p>
          <p className="text-xs text-neutral-600">
            {condition.waveDescription}
          </p>
        </div>
        
        {/* Wind Speed */}
        <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
          <i className="fas fa-wind text-2xl text-primary mb-1"></i>
          <p className="text-xs text-neutral-500">Wind Speed</p>
          <p className="font-semibold">{condition.windSpeed} km/h</p>
          <p className="text-xs text-neutral-600">
            {condition.windDescription}
          </p>
        </div>
        
        {/* UV Index */}
        <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
          <i className="fas fa-sun text-2xl text-caution mb-1"></i>
          <p className="text-xs text-neutral-500">UV Index</p>
          <p className="font-semibold">
            {condition.uvIndex} ({uvInfo.description})
          </p>
          <p className={`text-xs ${uvInfo.color}`}>
            {condition.uvDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentConditions;
