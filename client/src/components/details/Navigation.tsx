import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { BeachWithDetails } from "@/types";
import { AppContext } from "@/contexts/AppContext";
import { formatDistance } from "@/lib/utils";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface NavigationProps {
  beach: BeachWithDetails;
}

const Navigation = ({ beach }: NavigationProps) => {
  const { state } = useContext(AppContext);
  const [distance, setDistance] = useState<number | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);
  
  // Calculate distance and travel time
  useEffect(() => {
    if (state.userLocation) {
      // Simple distance calculation (Haversine formula)
      const R = 6371; // Earth radius in km
      const dLat = (Number(beach.latitude) - state.userLocation.coordinates.latitude) * Math.PI / 180;
      const dLon = (Number(beach.longitude) - state.userLocation.coordinates.longitude) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(state.userLocation.coordinates.latitude * Math.PI / 180) * Math.cos(Number(beach.latitude) * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const calculatedDistance = R * c;
      
      setDistance(Math.round(calculatedDistance * 10) / 10);
      
      // Estimate travel time (assuming 40 km/h average speed)
      const travelTimeMinutes = Math.round(calculatedDistance * 60 / 40);
      setTravelTime(`${travelTimeMinutes} mins`);
    }
  }, [state.userLocation, beach]);
  
  const handleGetDirections = () => {
    if (state.userLocation) {
      // Open in Google Maps
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${state.userLocation.coordinates.latitude},${state.userLocation.coordinates.longitude}&destination=${beach.latitude},${beach.longitude}`,
        "_blank"
      );
    }
  };
  
  // Custom beach marker icon
  const beachIcon = new L.DivIcon({
    className: "beach-marker-safe",
    html: `<div></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  
  // Custom user location marker icon
  const userIcon = new L.DivIcon({
    className: "user-location-marker",
    html: `<div></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-lg mb-3">Navigation</h3>
      
      <div className="flex items-center justify-between mb-3">
        <div>
          {state.userLocation ? (
            <>
              <p className="text-neutral-700">
                Your location is {distance ? formatDistance(distance) : "calculating..."}
              </p>
              {travelTime && (
                <p className="text-neutral-500 text-sm">
                  Approx. travel time: {travelTime}
                </p>
              )}
            </>
          ) : (
            <p className="text-neutral-700">
              Enable location services to get directions
            </p>
          )}
        </div>
        <Button 
          onClick={handleGetDirections} 
          disabled={!state.userLocation}
        >
          <i className="fas fa-directions mr-1"></i>
          Get Directions
        </Button>
      </div>
      
      <div className="h-56 bg-neutral-200 rounded-lg overflow-hidden">
        <MapContainer 
          center={[Number(beach.latitude), Number(beach.longitude)]} 
          zoom={12} 
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Beach marker */}
          <Marker 
            position={[Number(beach.latitude), Number(beach.longitude)]} 
            icon={beachIcon}
          >
            <Popup>
              <div className="font-medium">{beach.name}</div>
              <div className="text-sm">{beach.location}</div>
            </Popup>
          </Marker>
          
          {/* User location marker */}
          {state.userLocation && (
            <Marker 
              position={[
                state.userLocation.coordinates.latitude, 
                state.userLocation.coordinates.longitude
              ]} 
              icon={userIcon}
            >
              <Popup>
                <div className="font-medium">Your Location</div>
                <div className="text-sm">{state.userLocation.address}</div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Navigation;
