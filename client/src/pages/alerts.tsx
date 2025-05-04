import { useQuery } from "@tanstack/react-query";
import { fetchAlerts } from "@/lib/api";
import { AlertWithPriority } from "@/types";
import { Button } from "@/components/ui/button";
import AlertCard from "@/components/alerts/AlertCard";
import EmergencyContact from "@/components/alerts/EmergencyContact";

const Alerts = () => {
  // Fetch all alerts without filtering
  const { 
    data: alerts, 
    isLoading, 
    refetch 
  } = useQuery<AlertWithPriority[]>({
    queryKey: [`/api/alerts`],
  });
  
  const handleRefresh = () => {
    refetch();
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Alerts & Notifications</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <i className={`fas fa-sync-alt mr-1 ${isLoading ? 'animate-spin' : ''}`}></i>
          Refresh
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <p className="text-neutral-700">
          <i className="fas fa-info-circle text-primary mr-2"></i>
          Stay informed about important safety announcements, weather warnings, and beach condition updates.
        </p>
      </div>
      
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : !alerts || alerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <i className="fas fa-bell-slash text-4xl text-neutral-400 mb-2"></i>
            <h3 className="text-lg font-semibold mb-1">No active alerts</h3>
            <p className="text-neutral-500">
              There are no active alerts at this time. Check back later for updates.
            </p>
          </div>
        ) : (
          alerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        )}
      </div>
      
      <EmergencyContact />
    </div>
  );
};

export default Alerts;
