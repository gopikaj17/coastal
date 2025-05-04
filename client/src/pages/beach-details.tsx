import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { fetchBeachDetails } from "@/lib/api";
import { BeachWithDetails } from "@/types";
import { useToast } from "@/hooks/use-toast";

import BeachDetailsHeader from "@/components/details/BeachDetailsHeader";
import BeachDetailsBanner from "@/components/details/BeachDetailsBanner";
import CurrentConditions from "@/components/details/CurrentConditions";
import WaterSafety from "@/components/details/WaterSafety";
import HazardsAlerts from "@/components/details/HazardsAlerts";
import NearbyAmenities from "@/components/details/NearbyAmenities";
import Navigation from "@/components/details/Navigation";

const BeachDetails = () => {
  const [, params] = useRoute<{ id: string }>("/beach/:id");
  const { toast } = useToast();
  const [beachId, setBeachId] = useState<number | null>(null);
  
  useEffect(() => {
    // Convert and validate beach ID from URL params
    if (params && params.id) {
      const id = parseInt(params.id);
      if (!isNaN(id)) {
        setBeachId(id);
      } else {
        toast({
          title: "Invalid beach ID",
          description: "The requested beach could not be found.",
          variant: "destructive",
        });
      }
    }
  }, [params, toast]);
  
  // Fetch beach details
  const { data: beach, isLoading, error } = useQuery<BeachWithDetails>({
    queryKey: [`/api/beaches/${beachId}`],
    enabled: beachId !== null,
  });
  
  if (isLoading) {
    return (
      <div>
        <BeachDetailsHeader />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error || !beach) {
    return (
      <div>
        <BeachDetailsHeader />
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <i className="fas fa-exclamation-circle text-4xl text-unsafe mb-2"></i>
          <h3 className="text-lg font-semibold mb-1">Beach not found</h3>
          <p className="text-neutral-500">
            The requested beach could not be found or an error occurred while loading the data.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <BeachDetailsHeader />
      <BeachDetailsBanner beach={beach} />
      <CurrentConditions beach={beach} />
      <WaterSafety beach={beach} />
      <HazardsAlerts beach={beach} />
      <NearbyAmenities beach={beach} />
      <Navigation beach={beach} />
    </div>
  );
};

export default BeachDetails;
