import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { fetchBeaches } from "@/lib/api";
import { BeachWithCondition } from "@/types";

import BeachMap from "@/components/map/BeachMap";
import MapLegend from "@/components/map/MapLegend";

const Map = () => {
  const [, setLocation] = useLocation();
  const [filteredBeaches, setFilteredBeaches] = useState<BeachWithCondition[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  
  // Fetch all beaches
  const { data: beaches, isLoading } = useQuery<BeachWithCondition[]>({
    queryKey: ['/api/beaches'],
  });
  
  // Apply filters when beaches data is available
  useEffect(() => {
    if (!beaches) return;
    
    if (!filter) {
      setFilteredBeaches(beaches);
      return;
    }
    
    // Filter beaches by safety status
    const filtered = beaches.filter(beach => {
      const status = beach.conditions[0]?.safetyStatus.toLowerCase();
      return status === filter;
    });
    
    setFilteredBeaches(filtered);
  }, [beaches, filter]);
  
  // Handle selecting a beach on the map
  const handleSelectBeach = (beachId: number) => {
    setLocation(`/beach/${beachId}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!beaches || beaches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <i className="fas fa-map-marked-alt text-4xl text-neutral-400 mb-2"></i>
        <h3 className="text-lg font-semibold mb-1">No beaches available</h3>
        <p className="text-neutral-500">
          There are no beaches to display on the map.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <BeachMap 
        beaches={filteredBeaches.length > 0 ? filteredBeaches : beaches} 
        onSelectBeach={handleSelectBeach}
      />
      <MapLegend />
    </div>
  );
};

export default Map;
