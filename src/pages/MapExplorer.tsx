import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Wind, Droplets, Thermometer, FileText, ArrowRight } from "lucide-react";
import MapView from "@/components/MapView";
import { useRegion } from "@/contexts/RegionContext";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const MapExplorer = () => {
  const [activeLayer, setActiveLayer] = useState<string>("air-quality");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { setSelectedRegion, fetchRegionData, loading, error } = useRegion();
  const navigate = useNavigate();

  const handleRegionSelect = async (region: any) => {
    toast({
      title: "Fetching Data...",
      description: `Loading air quality data for ${region.city}...`,
    });

    // Fetch live data for the selected region
    await fetchRegionData(region.lat, region.lng, region.city);

    // Show success message after data is fetched
    toast({
      title: "Data Loaded Successfully",
      description: "Go to 'Report' tab to see the selected location's report",
      duration: 5000,
    });
  };

  const layers = [
    { id: "air-quality", name: "Air Quality", icon: Wind },
    { id: "temperature", name: "Temperature", icon: Thermometer },
    { id: "humidity", name: "Humidity", icon: Droplets },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <Layers className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Map Explorer</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Explore real-time air quality and weather data across the globe
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Loading/Error Status */}
            {(loading || error) && (
              <Card>
                <CardContent className="pt-6">
                  {loading && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                      <span>Fetching live data...</span>
                    </div>
                  )}
                  {error && (
                    <div className="text-sm text-amber-600 dark:text-amber-400">
                      ⚠️ {error}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Layers</CardTitle>
                <CardDescription>Toggle data layers on the map</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {layers.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <Button
                      key={layer.id}
                      variant={activeLayer === layer.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setActiveLayer(layer.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {layer.name}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Air Quality Index</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full air-quality-good" />
                  <span className="text-sm">0-50 Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full air-quality-moderate" />
                  <span className="text-sm">51-100 Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full air-quality-unhealthy-sensitive" />
                  <span className="text-sm">101-150 Unhealthy (Sensitive)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full air-quality-unhealthy" />
                  <span className="text-sm">151-200 Unhealthy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full air-quality-very-unhealthy" />
                  <span className="text-sm">201-300 Very Unhealthy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full air-quality-hazardous" />
                  <span className="text-sm">301+ Hazardous</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] overflow-hidden">
              <CardContent className="p-0 h-full">
                <MapView onRegionSelect={handleRegionSelect} isLoading={loading} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Report Navigation Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Data Fetched Successfully
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              Air quality data has been loaded successfully. View the detailed report with pollutant levels, health recommendations, and more.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowReportDialog(false)}
              className="flex-1"
            >
              Stay Here
            </Button>
            <Button 
              onClick={() => {
                setShowReportDialog(false);
                navigate('/report');
              }}
              className="flex-1"
            >
              View Report
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapExplorer;
