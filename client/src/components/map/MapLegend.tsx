const MapLegend = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 mb-4">
      <h3 className="font-medium mb-2">Map Legend</h3>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center">
          <span className="w-4 h-4 rounded-full bg-[#22C55E] mr-2"></span>
          <span className="text-sm">Safe</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 rounded-full bg-[#F59E0B] mr-2"></span>
          <span className="text-sm">Caution</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 rounded-full bg-[#EF4444] mr-2"></span>
          <span className="text-sm">Unsafe</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
          <span className="text-sm">Your Location</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
