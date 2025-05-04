import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BeachWithDetails } from "@/types";
import { fetchBeachAmenities } from "@/lib/api";
import { Link } from "wouter";

interface NearbyAmenitiesProps {
  beach: BeachWithDetails;
  maxDisplay?: number;
}

const NearbyAmenities = ({ beach, maxDisplay = 4 }: NearbyAmenitiesProps) => {
  // Fetch all amenities
  const { data: amenities, isLoading } = useQuery({
    queryKey: [`/api/beaches/${beach.id}/amenities`],
    enabled: beach.amenities.length === 0, // Only fetch if not already included in beach details
  });
  
  // Use the amenities from the beach object if available, otherwise use the fetched data
  const displayAmenities = beach.amenities.length > 0 ? beach.amenities : amenities || [];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-lg mb-3">Nearby Amenities</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : displayAmenities.length === 0 ? (
        <p className="text-neutral-500 text-center py-2">No amenities information available</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {displayAmenities.slice(0, maxDisplay).map(amenity => (
              <div key={amenity.id} className="flex flex-col items-center p-3 rounded-lg">
                <i className={`${amenity.icon} text-2xl text-primary mb-1`}></i>
                <p className="text-sm text-center">{amenity.name}</p>
                <p className="text-xs text-neutral-500">{amenity.distance}m away</p>
              </div>
            ))}
          </div>
          
          {displayAmenities.length > maxDisplay && (
            <div className="mt-4 flex justify-center">
              <Link href={`/beach/${beach.id}/amenities`}>
                <Button>
                  <i className="fas fa-map-marked-alt mr-2"></i>
                  View All Amenities
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NearbyAmenities;
