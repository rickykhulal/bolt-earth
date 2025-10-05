import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockAirQualityData, getAQIColor, getAQILabel, AirQualityData } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapViewProps {
  onRegionSelect?: (region: AirQualityData) => void;
  isLoading?: boolean;
}

const MapView = ({ onRegionSelect, isLoading }: MapViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const handleSearch = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
  };

  const handleSearchSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (mapInstanceRef.current) {
      // Remove previous marker if it exists
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Zoom in closer to the location (zoom level 13 instead of 10)
      mapInstanceRef.current.setView([lat, lng], 13, {
        animate: true,
        duration: 1
      });

      // Add a marker at the selected location
      markerRef.current = L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(result.display_name.split(",")[0])
        .openPopup();
    }

    onRegionSelect?.({
      city: result.display_name.split(",")[0],
      country: result.display_name.split(",").pop()?.trim() || "",
      lat,
      lng,
      aqi: 0,
      pollutants: { no2: 0, pm25: 0, pm10: 0, ozone: 0, so2: 0, co: 0 },
      weather: { temp: 0, humidity: 0, windSpeed: 0, condition: "Clear" },
      lastUpdated: new Date().toISOString(),
      dataSource: "Search",
    });

    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
    }).setView([20, 0], 2);
    mapInstanceRef.current = map;

    // Add tile layer with English labels
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '© OpenStreetMap contributors, © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Markers will be added dynamically when user searches for locations

    return () => {
      if (mapInstanceRef.current) {
        // Stop any ongoing animations
        mapInstanceRef.current.stop();
        // Remove all event listeners
        mapInstanceRef.current.off();
        // Remove the map instance
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onRegionSelect]);

  return (
    <div className="relative w-full h-full">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] max-w-md">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Enter city or location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults.length > 0) {
                handleSearchSelect(searchResults[0]);
              }
            }}
            disabled={isLoading}
            className="pl-10 bg-background/95 backdrop-blur shadow-lg border-2"
          />
        </div>
      </div>

      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
};

export default MapView;
