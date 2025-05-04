import { useState, useContext, useEffect } from "react";
import { useLocation } from "wouter";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { BeachWithCondition } from "@/types";
import { AppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import L from "leaflet";

interface BeachMapProps {
  beaches: BeachWithCondition[];
  onSelectBeach?: (beachId: number) => void;
}

const BeachMap = ({ beaches, onSelectBeach }: BeachMapProps) => {
  const [, setLocation] = useLocation();
  const { state } = useContext(AppContext);
  const [mapCenter, setMapCenter] = useState<[number, number]>([13.0827, 80.2707]); // Default to Chennai
  const [mapZoom, setMapZoom] = useState(10);
  
  // Update map center to user location if available
  useEffect(() => {
    if (state.userLocation) {
      setMapCenter([
        state.userLocation.coordinates.latitude,
        state.userLocation.coordinates.longitude
      ]);
      setMapZoom(11);
    }
  }, [state.userLocation]);
  
  // Center the map on user's location
  const handleCenterOnUser = () => {
    if (state.userLocation) {
      setMapCenter([
        state.userLocation.coordinates.latitude,
        state.userLocation.coordinates.longitude
      ]);
      setMapZoom(13);
    }
  };
  
  // Handle view beach details
  const handleViewBeachDetails = (beachId: number) => {
    if (onSelectBeach) {
      onSelectBeach(beachId);
    } else {
      setLocation(`/beach/${beachId}`);
    }
  };
  
  // Custom user location marker icon
  const userIcon = new L.DivIcon({
    className: "user-location-marker",
    html: `<div></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Beach Map</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={handleCenterOnUser} 
            disabled={!state.userLocation}
          >
            <i className="fas fa-location-arrow mr-1"></i>
            My Location
          </Button>
        </div>
      </div>
      
      <div className="h-[70vh] bg-neutral-200 rounded-lg overflow-hidden mb-4">
        <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
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
          
          {/* Beach markers */}
          {beaches.map(beach => {
            const status = beach.conditions[0]?.safetyStatus.toLowerCase() || 'unknown';
            
            // Custom beach marker based on safety status
            const beachIcon = new L.DivIcon({
              className: `beach-marker-${status}`,
              html: `<div></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });
            
            return (
              <Marker 
                key={beach.id} 
                position={[Number(beach.latitude), Number(beach.longitude)]} 
                icon={beachIcon}
              >
                <Popup>
                  <div className="popup-content">
                    <h3>{beach.name}</h3>
                    <p className={`status status-${status}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </p>
                    <Button 
                      size="sm" 
                      className="view-details-btn"
                      onClick={() => handleViewBeachDetails(beach.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default BeachMap;
