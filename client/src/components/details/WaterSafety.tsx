import { BeachWithDetails } from "@/types";
import { getWaterQualityColor } from "@/lib/utils";

interface WaterSafetyProps {
  beach: BeachWithDetails;
}

const WaterSafety = ({ beach }: WaterSafetyProps) => {
  // Get the most recent condition data
  const condition = beach.conditions[0];
  
  // Return null if no condition data available (should never happen)
  if (!condition) return null;
  
  // Get water quality color
  const waterQualityColor = getWaterQualityColor(condition.waterQuality);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-lg mb-3">Water Safety</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Water Quality */}
        <div className="flex flex-col p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center mb-1">
            <i className="fas fa-tint text-primary mr-2"></i>
            <h4 className="font-medium">Water Quality</h4>
          </div>
          <div className="flex items-center mt-1">
            <div className="h-2 flex-1 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${condition.waterQuality === 'good' ? 'bg-safe' : condition.waterQuality === 'moderate' ? 'bg-caution' : 'bg-unsafe'} ${condition.waterQuality === 'good' ? 'w-4/5' : condition.waterQuality === 'moderate' ? 'w-1/2' : 'w-1/5'}`}>
              </div>
            </div>
            <span className={`ml-2 ${waterQualityColor} font-medium`}>
              {condition.waterQuality.charAt(0).toUpperCase() + condition.waterQuality.slice(1)}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-2">
            {condition.waterQualityDescription}
          </p>
        </div>
        
        {/* Tide Information */}
        <div className="flex flex-col p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center mb-1">
            <i className="fas fa-water text-primary mr-2"></i>
            <h4 className="font-medium">Tide Information</h4>
          </div>
          <p className="text-sm">{condition.tideTime}</p>
          <p className="text-xs text-neutral-600 mt-1">
            Current: {condition.tideDescription}
          </p>
        </div>
        
        {/* Swimming Advisory */}
        <div className="flex flex-col p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center mb-1">
            <i className="fas fa-swimmer text-primary mr-2"></i>
            <h4 className="font-medium">Swimming Advisory</h4>
          </div>
          <div className="flex items-center mt-1">
            <span className={`${condition.swimmingAdvisory.toLowerCase().includes('safe') ? 'text-safe' : condition.swimmingAdvisory.toLowerCase().includes('caution') ? 'text-caution' : 'text-unsafe'} font-medium flex items-center`}>
              <i className={`${condition.swimmingAdvisory.toLowerCase().includes('safe') ? 'fas fa-check-circle' : condition.swimmingAdvisory.toLowerCase().includes('caution') ? 'fas fa-exclamation-circle' : 'fas fa-times-circle'} mr-1`}></i>
              {condition.swimmingAdvisory}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-2">
            {condition.advisoryDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaterSafety;
