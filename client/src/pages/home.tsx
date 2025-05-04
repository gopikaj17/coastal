import { useState, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppContext } from "@/contexts/AppContext";
import { fetchBeaches } from "@/lib/api";
import { BeachWithCondition } from "@/types";
import { useToast } from "@/hooks/use-toast";

import SearchBar from "@/components/home/SearchBar";
import UserLocation from "@/components/home/UserLocation";
import BeachCard from "@/components/home/BeachCard";

const Home = () => {
  const { state } = useContext(AppContext);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [displayBeaches, setDisplayBeaches] = useState<BeachWithCondition[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  
  // Fetch all beaches
  const { data: beaches, isLoading: isLoadingBeaches } = useQuery<BeachWithCondition[]>({
    queryKey: ['/api/beaches'],
  });
  
  // Show all beaches (for the "Show All" button)
  const handleShowAllBeaches = async () => {
    if (!state.userLocation) {
      toast({
        title: "Location not available",
        description: "Please enable location services.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Since we're showing all Indian beaches regardless of distance
      if (beaches && beaches.length > 0) {
        setDisplayBeaches(beaches);
        setSearchQuery("");
        
        toast({
          title: "All beaches shown",
          description: `Displaying all available beaches in India.`,
        });
      }
    } catch (error) {
      console.error("Error displaying all beaches:", error);
      toast({
        title: "Error displaying beaches",
        description: "An error occurred while trying to show all beaches.",
        variant: "destructive",
      });
    }
  };
  
  // Handle search results from the location search
  const handleSearchResults = (locationName: string, nearbyBeaches: BeachWithCondition[]) => {
    setSearchQuery(locationName);
    setDisplayBeaches(nearbyBeaches);
    setIsSearchingLocation(false);
  };
  
  // Initialize display beaches when data is loaded
  useEffect(() => {
    if (beaches && beaches.length > 0 && !searchQuery) {
      setDisplayBeaches(beaches);
    }
  }, [beaches, searchQuery]);
  
  return (
    <div>
      <SearchBar onSearchResults={handleSearchResults} />
      
      <UserLocation onFindNearbyBeaches={handleShowAllBeaches} />
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center">
          {searchQuery ? (
            <>
              <i className="fas fa-map-marker-alt text-primary mr-2"></i>
              Beaches near {searchQuery}
            </>
          ) : (
            <>
              <i className="fas fa-umbrella-beach text-primary mr-2"></i>
              Beach Suitability Dashboard
            </>
          )}
        </h2>
        
        {isLoadingBeaches || isSearchingLocation ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : displayBeaches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <i className="fas fa-search text-4xl text-neutral-400 mb-2"></i>
            <h3 className="text-lg font-semibold mb-1">No beaches found</h3>
            <p className="text-neutral-500">
              {searchQuery ? 
                `No beaches found near "${searchQuery}" within 300km` : 
                "Try searching for a location to find nearby beaches"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Sort beaches by distance if available */}
            {displayBeaches
              .sort((a, b) => {
                // If both have distance, sort by distance
                if (a.distance && b.distance) {
                  return a.distance - b.distance;
                }
                // If only one has distance, put the one with distance first
                if (a.distance) return -1;
                if (b.distance) return 1;
                // Otherwise sort by ID
                return a.id - b.id;
              })
              .map(beach => (
                <BeachCard key={beach.id} beach={beach} />
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
