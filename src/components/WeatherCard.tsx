import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Eye, Gauge, Sun } from "lucide-react";

interface WeatherCardProps {
  current: {
    temperature: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_direction: string;
    pressure: number;
    visibility: number;
    cloud_cover: number;
    uv_index: number;
    condition: string;
    condition_icon: string;
    is_day: number;
  };
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
}

export const WeatherCard = ({ current, location }: WeatherCardProps) => {
  const lastUpdated = new Date(location.localtime).toLocaleString();

  return (
    <Card className="w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{location.name}</h2>
            <p className="text-sm text-muted-foreground">
              {location.region}, {location.country}
            </p>
          </div>
          <img 
            src={`https:${current.condition_icon}`} 
            alt={current.condition}
            className="w-16 h-16"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Temperature */}
        <div className="text-center">
          <div className="text-6xl font-bold">{Math.round(current.temperature)}°C</div>
          <div className="text-xl text-muted-foreground mt-2">{current.condition}</div>
          <div className="text-sm text-muted-foreground">
            Feels like {Math.round(current.feels_like)}°C
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 p-3 bg-background/50 rounded-lg">
            <Droplets className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-xs text-muted-foreground">Humidity</div>
              <div className="font-semibold">{current.humidity}%</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-background/50 rounded-lg">
            <Wind className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-xs text-muted-foreground">Wind</div>
              <div className="font-semibold">{current.wind_speed} km/h {current.wind_direction}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-background/50 rounded-lg">
            <Gauge className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-xs text-muted-foreground">Pressure</div>
              <div className="font-semibold">{current.pressure} hPa</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-background/50 rounded-lg">
            <Eye className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-xs text-muted-foreground">Visibility</div>
              <div className="font-semibold">{current.visibility} km</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-background/50 rounded-lg">
            <Cloud className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-xs text-muted-foreground">Cloud Cover</div>
              <div className="font-semibold">{current.cloud_cover}%</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-background/50 rounded-lg">
            <Sun className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-xs text-muted-foreground">UV Index</div>
              <div className="font-semibold">{current.uv_index}</div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-center text-muted-foreground">
          Last updated: {lastUpdated}
        </div>
      </CardContent>
    </Card>
  );
};
