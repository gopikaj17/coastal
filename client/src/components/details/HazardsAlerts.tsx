import { BeachWithDetails } from "@/types";

interface HazardsAlertsProps {
  beach: BeachWithDetails;
}

const HazardsAlerts = ({ beach }: HazardsAlertsProps) => {
  const activeHazards = beach.hazards.filter(hazard => hazard.active);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-lg mb-3">Hazards & Alerts</h3>
      
      <div className="space-y-3">
        {activeHazards.length > 0 ? (
          activeHazards.map(hazard => (
            <div 
              key={hazard.id}
              className={`p-3 ${hazard.severity === 'high' ? 'bg-unsafe/10' : hazard.severity === 'moderate' ? 'bg-caution/10' : 'bg-neutral-100'} rounded-lg flex`}
            >
              <i className={`${hazard.icon} ${hazard.severity === 'high' ? 'text-unsafe' : hazard.severity === 'moderate' ? 'text-caution' : 'text-primary'} text-xl self-center mr-3`}></i>
              <div>
                <h4 className={`font-medium ${hazard.severity === 'high' ? 'text-unsafe' : hazard.severity === 'moderate' ? 'text-caution' : 'text-neutral-700'}`}>
                  {hazard.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Alert
                </h4>
                <p className="text-sm text-neutral-700">
                  {hazard.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 bg-neutral-100 rounded-lg flex">
            <i className="fas fa-info-circle text-primary text-xl self-center mr-3"></i>
            <div>
              <h4 className="font-medium text-neutral-700">No Major Alerts</h4>
              <p className="text-sm text-neutral-700">
                No hazards or warnings are currently active for this beach.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HazardsAlerts;
