import { AlertFilterType } from "@/types";

interface AlertFiltersProps {
  currentFilter: AlertFilterType;
  onFilterChange: (filter: AlertFilterType) => void;
}

const AlertFilters = ({ currentFilter, onFilterChange }: AlertFiltersProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
      <button 
        className={`${currentFilter === 'all' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700'} px-3 py-1 rounded-full text-sm whitespace-nowrap`}
        onClick={() => onFilterChange('all')}
      >
        All Alerts
      </button>
      <button 
        className={`${currentFilter === 'weather' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700'} px-3 py-1 rounded-full text-sm whitespace-nowrap`}
        onClick={() => onFilterChange('weather')}
      >
        Weather
      </button>
      <button 
        className={`${currentFilter === 'ocean' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700'} px-3 py-1 rounded-full text-sm whitespace-nowrap`}
        onClick={() => onFilterChange('ocean')}
      >
        Ocean Conditions
      </button>
      <button 
        className={`${currentFilter === 'water_quality' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700'} px-3 py-1 rounded-full text-sm whitespace-nowrap`}
        onClick={() => onFilterChange('water_quality')}
      >
        Water Quality
      </button>
      <button 
        className={`${currentFilter === 'safety' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700'} px-3 py-1 rounded-full text-sm whitespace-nowrap`}
        onClick={() => onFilterChange('safety')}
      >
        Safety
      </button>
    </div>
  );
};

export default AlertFilters;
