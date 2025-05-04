import { createContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  fetchUserSettings, 
  getUserLocation, 
  getAddressFromCoords,
  updateUserSettings
} from "@/lib/api";
import { AppState, LocationInfo, Coordinates } from "@/types";
import { UserSettings } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Initial state
const initialState: AppState = {
  userLocation: null,
  settings: null,
  isLoading: true,
  error: null
};

// Context type definition
interface AppContextType {
  state: AppState;
  refreshUserLocation: () => Promise<void>;
  updateSettings: (settings: UserSettings) => void;
  setManualLocation: (coordinates: Coordinates, address: string) => void;
}

// Create context
export const AppContext = createContext<AppContextType>({
  state: initialState,
  refreshUserLocation: async () => {},
  updateSettings: () => {},
  setManualLocation: () => {}
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, setState] = useState<AppState>(initialState);
  const { toast } = useToast();
  
  // Fetch user settings
  const { data: settings } = useQuery<UserSettings>({
    queryKey: ['/api/settings'],
    onSuccess: (data) => {
      setState(prevState => ({
        ...prevState,
        settings: data,
        isLoading: false
      }));
    },
    onError: (error) => {
      console.error("Error fetching user settings:", error);
      setState(prevState => ({
        ...prevState,
        error: "Failed to load user settings",
        isLoading: false
      }));
    }
  });
  
  // Update user location
  const refreshUserLocation = async () => {
    try {
      // Check if location services are enabled in settings
      if (state.settings && !state.settings.locationServices) {
        throw new Error("Location services are disabled in settings");
      }
      
      // Get user's coordinates
      const coordinates = await getUserLocation();
      
      // Get address from coordinates
      const address = await getAddressFromCoords(coordinates);
      
      // Update state with location info
      setState(prevState => ({
        ...prevState,
        userLocation: {
          coordinates,
          address,
          lastUpdated: new Date()
        }
      }));
      
      return;
    } catch (error) {
      console.error("Error getting user location:", error);
      
      // Show error toast
      toast({
        title: "Location error",
        description: "Failed to get your current location. Please check your device settings.",
        variant: "destructive",
      });
      
      setState(prevState => ({
        ...prevState,
        error: "Failed to get user location"
      }));
      
      throw error;
    }
  };
  
  // Manually set user location (used when selecting a location from search)
  const setManualLocation = (coordinates: Coordinates, address: string) => {
    setState(prevState => ({
      ...prevState,
      userLocation: {
        coordinates,
        address,
        lastUpdated: new Date()
      }
    }));
    
    toast({
      title: "Location updated",
      description: `Location set to ${address}`,
    });
  };
  
  // Update settings
  const updateSettings = (newSettings: UserSettings) => {
    setState(prevState => ({
      ...prevState,
      settings: newSettings
    }));
    
    // Apply dark mode if applicable
    if (newSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Initialize user location if location services are enabled
  useEffect(() => {
    if (state.settings && state.settings.locationServices && !state.userLocation) {
      // For this demo, instead of using browser geolocation which might be inaccurate,
      // set Chennai as the default location for testing
      const defaultLocation = {
        coordinates: {
          latitude: 13.0827,
          longitude: 80.2707
        },
        address: "Chennai, Tamil Nadu"
      };
      
      setState(prevState => ({
        ...prevState,
        userLocation: {
          ...defaultLocation,
          lastUpdated: new Date()
        }
      }));
      
      // Also try to get actual location in the background
      refreshUserLocation().catch(err => {
        console.error("Failed to initialize user location:", err);
      });
    }
  }, [state.settings]);
  
  // Apply dark mode based on settings
  useEffect(() => {
    if (state.settings) {
      if (state.settings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [state.settings]);
  
  const contextValue: AppContextType = {
    state,
    refreshUserLocation,
    updateSettings,
    setManualLocation
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
