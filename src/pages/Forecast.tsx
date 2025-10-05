import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Wind } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { mockForecastData } from "@/lib/mockData";

const Forecast = () => {
  const [trafficEmissions, setTrafficEmissions] = useState([0]);
  const [windSpeed, setWindSpeed] = useState([0]);

  const adjustedData = mockForecastData.map((day) => ({
    ...day,
    aqi: Math.max(0, Math.round(day.aqi * (1 + trafficEmissions[0] / 100 - windSpeed[0] / 200))),
    no2: Math.max(0, Math.round(day.no2 * (1 + trafficEmissions[0] / 100))),
    pm25: Math.max(0, Math.round(day.pm25 * (1 + trafficEmissions[0] / 100 - windSpeed[0] / 200))),
  }));

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Air Quality Forecast</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            7-day forecast with interactive scenario simulation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Simulation Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scenario Simulation</CardTitle>
                <CardDescription>
                  Adjust parameters to see how they affect air quality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Traffic Emissions</label>
                    <Badge variant="secondary">{trafficEmissions[0] > 0 ? "+" : ""}{trafficEmissions[0]}%</Badge>
                  </div>
                  <Slider
                    value={trafficEmissions}
                    onValueChange={setTrafficEmissions}
                    min={-50}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Simulate changes in vehicle emissions
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Wind Speed</label>
                    <Badge variant="secondary">{windSpeed[0] > 0 ? "+" : ""}{windSpeed[0]}%</Badge>
                  </div>
                  <Slider
                    value={windSpeed}
                    onValueChange={setWindSpeed}
                    min={-50}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Adjust wind speed for pollutant dispersion
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Wind className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p>Increased traffic emissions directly correlate with higher NO₂ and PM2.5 levels</p>
                </div>
                <div className="flex items-start gap-2">
                  <Wind className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p>Higher wind speeds help disperse pollutants, improving air quality</p>
                </div>
                <div className="flex items-start gap-2">
                  <BarChart3 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <p>Weekend trends show lower pollution due to reduced traffic</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>7-Day AQI Forecast</CardTitle>
                <CardDescription>Air Quality Index prediction</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={adjustedData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="aqi" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="AQI"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pollutant Levels</CardTitle>
                <CardDescription>NO₂ and PM2.5 concentration forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={adjustedData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="no2" fill="hsl(var(--primary))" name="NO₂ (µg/m³)" />
                    <Bar dataKey="pm25" fill="hsl(var(--accent))" name="PM2.5 (µg/m³)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
