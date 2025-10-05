import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, MapPin, Calendar, Eye } from "lucide-react";
import { jsPDF } from "jspdf";
import { mockAirQualityData, getAQILabel, whoGuidelines } from "@/lib/mockData";
import { useRegion } from "@/contexts/RegionContext";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Report = () => {
  const { selectedRegion, fetchRegionData } = useRegion();
  const [showPreview, setShowPreview] = useState(false);
  
  const locations = [
    { name: "New York", lat: 40.7128, lng: -74.006 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
    { name: "Delhi", lat: 28.6139, lng: 77.209 },
    { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  ];

  const handleLocationChange = async (locationName: string) => {
    const location = locations.find((loc) => loc.name === locationName);
    if (location) {
      await fetchRegionData(location.lat, location.lng, location.name);
    }
  };
  
  const regionData = selectedRegion || null;

  const generatePDF = () => {
    if (!regionData) {
      toast({
        title: "No Region Selected",
        description: "Please select a region on the Map Explorer before exporting a report.",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF();
    const selectedCity = regionData;

    // Title
    doc.setFontSize(20);
    doc.text(`Air Quality Report - ${selectedCity.city}`, 20, 20);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);

    // Helper function to format values with "Data unavailable" fallback
    const formatValue = (value: number | null | undefined, decimals: number = 2, unit: string = ''): string => {
      if (value === null || value === undefined) return 'Data unavailable';
      // Check for invalid sentinel values
      if (value === -999 || value === 0) return 'Data unavailable';
      return `${value.toFixed(decimals)}${unit}`;
    };

    // Location Section
    doc.setFontSize(14);
    doc.text("Location Information", 20, 45);
    doc.setFontSize(10);
    doc.text(`City: ${selectedCity.city}`, 20, 55);
    doc.text(`Coordinates: ${selectedCity.lat.toFixed(4)}, ${selectedCity.lng.toFixed(4)}`, 20, 62);
    if (selectedCity.dataSource) {
      doc.text(`Data Source: ${selectedCity.dataSource}`, 20, 69);
    }
    if (selectedCity.lastUpdated) {
      const updateTime = new Date(selectedCity.lastUpdated).toLocaleString();
      doc.text(`Last Updated: ${updateTime} UTC`, 20, 76);
    }

    // Air Quality Section
    doc.setFontSize(14);
    doc.text("Current Air Quality", 20, 90);
    doc.setFontSize(10);
    let yPos = 100;
    doc.text(`AQI: ${selectedCity.aqi || 'Data unavailable'} - ${selectedCity.aqi ? getAQILabel(selectedCity.aqi) : 'N/A'}`, 20, yPos);
    yPos += 8;
    doc.text(`NO₂: ${formatValue(selectedCity.pollutants.no2, 2, ' µg/m³')}`, 20, yPos);
    yPos += 8;
    doc.text(`PM2.5: ${formatValue(selectedCity.pollutants.pm25, 2, ' µg/m³')}`, 20, yPos);
    yPos += 8;
    doc.text(`Ozone: ${formatValue(selectedCity.pollutants.ozone, 2, ' µg/m³')}`, 20, yPos);
    
    if (selectedCity.pollutants.pm10) {
      yPos += 8;
      doc.text(`PM10: ${formatValue(selectedCity.pollutants.pm10, 2, ' µg/m³')}`, 20, yPos);
    }
    if (selectedCity.pollutants.so2) {
      yPos += 8;
      doc.text(`SO₂: ${formatValue(selectedCity.pollutants.so2, 2, ' µg/m³')}`, 20, yPos);
    }
    if (selectedCity.pollutants.co) {
      yPos += 8;
      doc.text(`CO: ${formatValue(selectedCity.pollutants.co, 2, ' mg/m³')}`, 20, yPos);
    }

    // WHO Guidelines
    yPos += 20;
    doc.setFontSize(14);
    doc.text("WHO Guidelines Comparison", 20, yPos);
    yPos += 12;
    doc.setFontSize(10);
    whoGuidelines.forEach((guideline) => {
      const lines = doc.splitTextToSize(`${guideline.pollutant}: ${guideline.limit}`, 170);
      lines.forEach((line: string) => {
        doc.text(line, 20, yPos);
        yPos += 8;
      });
    });

    // Health Recommendations
    yPos += 18;
    doc.setFontSize(14);
    doc.text("Health Recommendations", 20, yPos);
    yPos += 12;
    doc.setFontSize(10);
    const recommendations = [
      "Monitor air quality daily using this platform",
      "Limit outdoor activities when AQI exceeds 100",
      "Use air purifiers indoors on high pollution days",
      "Wear N95 masks when AQI exceeds 150",
    ];
    recommendations.forEach((rec) => {
      const lines = doc.splitTextToSize(`• ${rec}`, 170);
      lines.forEach((line: string) => {
        doc.text(line, 20, yPos);
        yPos += 8;
      });
    });

    // Footer - ensure enough space from content
    yPos += 20;
    doc.setFontSize(8);
    doc.text("Earth in Your Hands - NASA Space Apps Challenge 2025", 20, yPos);
    yPos += 5;
    doc.text(`Data Source: ${selectedCity.dataSource || "NASA TEMPO + OpenAQ"}`, 20, yPos);
    yPos += 5;
    doc.text("Powered by NASA TEMPO (satellite) and OpenAQ (ground stations)", 20, yPos);

    // Save PDF
    doc.save(`air-quality-report-${selectedCity.city}-${new Date().toISOString().split("T")[0]}.pdf`);
    
    toast({
      title: "Report Generated",
      description: `PDF report for ${selectedCity.city} has been downloaded.`,
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <FileDown className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Report Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Generate comprehensive air quality reports for your location
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>
                Your personalized air quality report includes current data, forecasts, and health
                recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">
                      {regionData ? regionData.city : "No region selected"}
                    </div>
                    {regionData?.dataSource && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Source: {regionData.dataSource}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Report Date</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </div>
                    {regionData?.lastUpdated && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Data updated: {new Date(regionData.lastUpdated).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!regionData && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    ⚠️ Please select a region on the <a href="/map" className="underline font-medium">Map Explorer</a> page before generating a report.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold">Report Includes:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>Current air quality index and pollutant levels</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>7-day air quality forecast</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>WHO guideline comparisons</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>Personalized health recommendations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>Data sources and methodology</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="flex-1"
                      disabled={!regionData}
                    >
                      <Eye className="mr-2 h-5 w-5" />
                      Preview Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Report Preview</DialogTitle>
                      <DialogDescription>
                        Review your report before exporting
                      </DialogDescription>
                    </DialogHeader>
                    {regionData && (
                      <div className="space-y-4 py-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Air Quality Report - {regionData.city}</h3>
                          <p className="text-sm text-muted-foreground">Generated: {new Date().toLocaleDateString()}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Location Information</h4>
                          <div className="text-sm space-y-1">
                            <p>City: {regionData.city}</p>
                            <p>Coordinates: {regionData.lat.toFixed(4)}, {regionData.lng.toFixed(4)}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Current Air Quality</h4>
                          <div className="text-sm space-y-1">
                            <p>AQI: {regionData.aqi && regionData.aqi > 0 ? `${regionData.aqi} - ${getAQILabel(regionData.aqi)}` : 'Data unavailable'}</p>
                            <p>NO₂: {regionData.pollutants.no2 && regionData.pollutants.no2 > 0 ? `${regionData.pollutants.no2.toFixed(2)} µg/m³` : 'Data unavailable'}</p>
                            <p>PM2.5: {regionData.pollutants.pm25 && regionData.pollutants.pm25 > 0 ? `${regionData.pollutants.pm25.toFixed(2)} µg/m³` : 'Data unavailable'}</p>
                            <p>Ozone: {regionData.pollutants.ozone && regionData.pollutants.ozone > 0 ? `${regionData.pollutants.ozone.toFixed(2)} µg/m³` : 'Data unavailable'}</p>
                            {regionData.pollutants.pm10 && regionData.pollutants.pm10 > 0 && (
                              <p>PM10: {regionData.pollutants.pm10.toFixed(2)} µg/m³</p>
                            )}
                            {regionData.pollutants.so2 && regionData.pollutants.so2 > 0 && (
                              <p>SO₂: {regionData.pollutants.so2.toFixed(2)} µg/m³</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Health Recommendations</h4>
                          <ul className="text-sm space-y-1 list-disc list-inside">
                            <li>Monitor air quality daily using this platform</li>
                            <li>Limit outdoor activities when AQI exceeds 100</li>
                            <li>Use air purifiers indoors on high pollution days</li>
                            <li>Wear N95 masks when AQI exceeds 150</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button 
                  onClick={generatePDF} 
                  size="lg" 
                  className="flex-1"
                  disabled={!regionData}
                >
                  <FileDown className="mr-2 h-5 w-5" />
                  Generate PDF Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Location</label>
                <select 
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={regionData?.city || locations[0].name}
                  onChange={(e) => handleLocationChange(e.target.value)}
                >
                  {locations.map((location) => (
                    <option key={location.name} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <select className="w-full p-2 border border-input rounded-md bg-background">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Report;
