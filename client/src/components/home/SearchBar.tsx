import { useState, useEffect, useRef, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coordinates, LocationResult } from "@/types";
import { searchLocations, searchBeachesNear } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AppContext } from "@/contexts/AppContext";

interface SearchBarProps {
  onSearchResults: (query: string, nearbyBeaches: any[]) => void;
}

const SearchBar = ({ onSearchResults }: SearchBarProps) => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    if (selectedLocation) {
      // If a location is already selected, use that
      await findBeachesNearLocation(selectedLocation);
    } else {
      // Otherwise search for locations
      setSearchingLocation(true);
      try {
        const results = await searchLocations(query);
        setLocations(results);
        
        if (results.length === 1) {
          // Auto-select if we only have one result
          await findBeachesNearLocation(results[0]);
        }
      } catch (error) {
        console.error("Error searching for locations:", error);
        toast({
          title: "Search error",
          description: "Failed to search for locations. Please try again.",
          variant: "destructive"
        });
      } finally {
        setSearchingLocation(false);
      }
    }
  };
  
  const findBeachesNearLocation = async (location: LocationResult) => {
    setSelectedLocation(location);
    setQuery(location.display);
    setLocations([]); // Close dropdown
    
    try {
      const coords: Coordinates = {
        latitude: location.latitude,
        longitude: location.longitude
      };
      
      // Update the user's selected location in the app context
      // This will help other components know which location is selected
      const { setManualLocation } = useContext(AppContext);
      setManualLocation(coords, location.display);
      
      // Find beaches near this location (300km radius by default)
      const beaches = await searchBeachesNear(coords);
      
      // Update the parent component with results
      onSearchResults(location.display, beaches);
      
      if (beaches.length === 0) {
        toast({
          title: "No beaches found",
          description: `No beaches found near ${location.display} within 300km.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Beaches found",
          description: `Found ${beaches.length} beaches near ${location.display}.`
        });
      }
    } catch (error) {
      console.error("Error finding beaches near location:", error);
      toast({
        title: "Search error",
        description: "Failed to find beaches near this location.",
        variant: "destructive"
      });
    }
  };
  
  // Auto-search locations as user types (after a delay)
  useEffect(() => {
    // Clear selected location when query changes
    if (selectedLocation && query !== selectedLocation.display) {
      setSelectedLocation(null);
    }
    
    if (!query.trim()) {
      setLocations([]);
      return;
    }
    
    const timer = setTimeout(async () => {
      if (!selectedLocation) {
        setSearchingLocation(true);
        try {
          const results = await searchLocations(query);
          setLocations(results);
        } catch (error) {
          console.error("Error searching for locations:", error);
        } finally {
          setSearchingLocation(false);
        }
      }
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [query, selectedLocation]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLocations([]);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-3 mb-1 flex items-center">
        <i className="fas fa-search text-neutral-500 mr-3"></i>
        <Input
          type="text"
          placeholder="Search by city or location in India..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none bg-transparent border-none shadow-none"
        />
        <Button type="submit" size="sm" className="ml-2" disabled={searchingLocation}>
          {searchingLocation ? (
            <span className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full" />
          ) : (
            <i className="fas fa-search"></i>
          )}
        </Button>
      </form>
      
      {/* Location search results dropdown */}
      {locations.length > 0 && (
        <div ref={dropdownRef} className="absolute z-50 bg-white w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {locations.map((location) => (
            <div 
              key={`${location.name}-${location.state}`}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
              onClick={() => findBeachesNearLocation(location)}
            >
              <div className="font-medium">{location.name}</div>
              <div className="text-sm text-gray-500">{location.state}</div>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-xs text-gray-500 ml-1">
        Search for any location in India to find nearby beaches. Examples: Chennai, Mumbai, Goa
      </p>
    </div>
  );
};

export default SearchBar;
