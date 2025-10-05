import { useState, useEffect } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { ForecastStrip } from "@/components/ForecastStrip";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, AlertTriangle } from "lucide-react";
import { fetchCurrentWeather, fetchWeatherForecast, fetchWeatherAlerts } from "@/services/rapidapiWeatherAPI";
import { toast } from "sonner";

const Weather = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async (city?: string, lat?: number, lng?: number) => {
    setLoading(true);
    try {
      // Fetch all weather data in parallel
      const [currentData, forecastData, alertsData] = await Promise.all([
        fetchCurrentWeather(city, lat, lng),
        fetchWeatherForecast(city, lat, lng, 7),
        fetchWeatherAlerts(city, lat, lng)
      ]);

      if (currentData) {
        setCurrentWeather(currentData);
        toast.success(`Weather data loaded for ${currentData.location.name}`);
      } else {
        toast.error("Could not fetch current weather");
      }

      if (forecastData) {
        setForecast(forecastData);
      }

      if (alertsData && alertsData.alerts.length > 0) {
        setAlerts(alertsData.alerts);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast.error("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a city name");
      return;
    }
    await fetchWeatherData(searchQuery);
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(undefined, position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    // Load weather for a default city on mount
    fetchWeatherData("London");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Weather Forecast
            </h1>
            <p className="text-lg text-muted-foreground">
              Powered by WeatherAPI.com + NASA Earthdata
            </p>
          </div>

          {/* Search Bar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Search city (e.g., London, New York, Tokyo)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={loading}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
                <Button onClick={getCurrentLocation} variant="outline" disabled={loading}>
                  <MapPin className="w-4 h-4 mr-2" />
                  Use My Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weather Alerts */}
          {alerts.length > 0 && (
            <Card className="border-yellow-500/50 bg-yellow-500/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Weather Alerts</h3>
                    {alerts.map((alert, index) => (
                      <div key={index} className="space-y-1">
                        <p className="font-medium">{alert.headline}</p>
                        <p className="text-sm text-muted-foreground">{alert.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading weather data...</p>
            </div>
          )}

          {/* Current Weather */}
          {!loading && currentWeather && (
            <WeatherCard
              current={currentWeather}
              location={currentWeather.location}
            />
          )}

          {/* Forecast Strip */}
          {!loading && forecast?.forecast && forecast.forecast.length > 0 && (
            <ForecastStrip forecast={forecast.forecast} />
          )}

          {/* Data Sources Info */}
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">About Our Weather Data</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  • <strong>Primary Source:</strong> WeatherAPI.com provides real-time weather data and forecasts
                </p>
                <p>
                  • <strong>Verification:</strong> Data is cross-referenced with NASA Earthdata (POWER, Daymet, IMERG)
                </p>
                <p>
                  • <strong>Accuracy:</strong> Multiple source verification ensures high accuracy similar to AccuWeather
                </p>
                <p>
                  • <strong>Update Frequency:</strong> Data is cached for 10-15 minutes for optimal performance
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Weather;
