import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { timeAgo } from "@/lib/utils";
import { fetchWeatherData } from "@/lib/api";
import { WeatherData, Coordinates } from "@/types";

interface UserLocationProps {
  onFindNearbyBeaches: () => void;
}

const UserLocation = ({ onFindNearbyBeaches }: UserLocationProps) => {
  const { state, refreshUserLocation, setManualLocation } = useContext(AppContext);
  const { toast } = useToast();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  
  const handleUpdateLocation = async () => {
    try {
      await refreshUserLocation();
      toast({
        title: "Location updated",
        description: "Your location has been successfully updated.",
      });
      
      // Fetch weather for new location
      if (state.userLocation) {
        fetchLocationWeather(state.userLocation.coordinates);
      }
    } catch (error) {
      toast({
        title: "Error updating location",
        description: "Please check your location settings and try again.",
        variant: "destructive",
      });
    }
  };
  
  const fetchLocationWeather = async (coords: { latitude: number; longitude: number }) => {
    try {
      setIsLoadingWeather(true);
      const weather = await fetchWeatherData(coords);
      setWeatherData(weather);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoadingWeather(false);
    }
  };
  
  // Set Chennai as the default location for the demo
  useEffect(() => {
    // If no location is set yet
    if (!state.userLocation) {
      // Default Chennai coordinates
      const defaultCoords = {
        latitude: 13.0827,
        longitude: 80.2707
      };
      const defaultAddress = "Chennai, Tamil Nadu";
      
      // Set manual location and fetch weather
      setManualLocation(defaultCoords, defaultAddress);
      fetchLocationWeather(defaultCoords);
    } else {
      // If location is already set, fetch weather
      fetchLocationWeather(state.userLocation.coordinates);
    }
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold flex items-center">
          <i className="fas fa-location-arrow text-primary mr-2"></i>
          Your Location
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary" 
          onClick={handleUpdateLocation}
        >
          <i className="fas fa-sync-alt mr-1"></i>
          Update
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex-1">
          {state.userLocation ? (
            <>
              <p className="text-neutral-700 font-semibold">{state.userLocation.address}</p>
              <p className="text-neutral-500 text-sm">
                Last updated: {timeAgo(state.userLocation.lastUpdated)}
              </p>
              
              {isLoadingWeather ? (
                <div className="mt-2 flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-b-2 border-primary rounded-full"></div>
                  <span className="text-sm">Loading weather...</span>
                </div>
              ) : weatherData ? (
                <div className="mt-3 p-2 bg-neutral-50 rounded-md">
                  <div className="flex items-center">
                    <i className={`fas fa-${weatherData.conditions === 'Clear' ? 'sun' : 'cloud'} text-2xl mr-2 text-yellow-500`}></i>
                    <div>
                      <div className="font-medium">{weatherData.conditions}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">{weatherData.temperature}°C</span>
                        <span className="text-neutral-500">Feels like {weatherData.feelsLike}°C</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-neutral-600">
                    <div><i className="fas fa-wind mr-1"></i> {weatherData.windSpeed} km/h</div>
                    <div><i className="fas fa-compass mr-1"></i> {weatherData.windDirection}</div>
                    <div><i className="fas fa-tint mr-1"></i> {weatherData.humidity}% humidity</div>
                    <div><i className="fas fa-sun mr-1"></i> UV Index: {weatherData.uvIndex}</div>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <p className="text-neutral-700">Location not available</p>
              <p className="text-neutral-500 text-sm">
                Enable location services to find nearby beaches
              </p>
            </>
          )}
        </div>
        <div className="mt-3 md:mt-0 md:ml-4">
          <Button 
            onClick={onFindNearbyBeaches}
            disabled={!state.userLocation}
          >
            <i className="fas fa-map-marker-alt mr-2"></i>
            Show All Beaches
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserLocation;
