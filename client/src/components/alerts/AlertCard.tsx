import { Link } from "wouter";
import { AlertWithPriority } from "@/types";
import { timeAgo, getPriorityColor } from "@/lib/utils";

interface AlertCardProps {
  alert: AlertWithPriority;
}

const AlertCard = ({ alert }: AlertCardProps) => {
  const priorityColor = getPriorityColor(alert.priority);
  
  // Get icon based on alert type
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'weather':
        return alert.icon || 'fas fa-sun';
      case 'ocean':
        return alert.icon || 'fas fa-water';
      case 'water_quality':
        return alert.icon || 'fas fa-tint';
      case 'safety':
        return alert.icon || 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-exclamation-circle';
    }
  };
  
  // Get border color based on priority
  const getBorderColor = () => {
    switch (alert.priority) {
      case 'high':
        return 'border-unsafe';
      case 'medium':
        return 'border-caution';
      case 'low':
        return 'border-neutral-300';
      default:
        return 'border-neutral-300';
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${getBorderColor()}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className={`${alert.priority === 'high' ? 'bg-unsafe/10' : alert.priority === 'medium' ? 'bg-caution/10' : 'bg-neutral-100'} p-2 rounded-full mr-3`}>
            <i className={`${getAlertIcon()} ${alert.priority === 'high' ? 'text-unsafe' : alert.priority === 'medium' ? 'text-caution' : 'text-neutral-700'}`}></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{alert.title}</h3>
              <span className="text-xs text-neutral-500">
                {timeAgo(alert.createdAt)}
              </span>
            </div>
            <p className="text-sm text-neutral-700 mt-1">
              {alert.description}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${priorityColor} px-2 py-1 rounded-full`}>
                {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)} Priority
              </span>
              
              {alert.beachId && (
                <Link href={`/beach/${alert.beachId}`}>
                  <a className="text-primary text-sm">View Details</a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
