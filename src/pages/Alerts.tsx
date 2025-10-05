import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Info, Heart } from "lucide-react";
import { whoGuidelines } from "@/lib/mockData";

const Alerts = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Health Alerts & Insights</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Air quality warnings and health recommendations based on WHO guidelines
          </p>
        </div>

        <div className="space-y-6">
          {/* Current Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Current Alerts</CardTitle>
              <CardDescription>Active air quality warnings for your region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle>Moderate Air Quality</AlertTitle>
                <AlertDescription>
                  Air quality is acceptable. However, sensitive individuals may experience minor
                  respiratory symptoms from prolonged outdoor exposure.
                </AlertDescription>
              </Alert>

              <Alert className="border-blue-500/50 bg-blue-500/10">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle>Weekend Forecast Improvement</AlertTitle>
                <AlertDescription>
                  Air quality is expected to improve over the weekend due to reduced traffic
                  and favorable wind conditions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* WHO Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>WHO Air Quality Guidelines</CardTitle>
              <CardDescription>
                World Health Organization recommended limits for key pollutants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {whoGuidelines.map((guideline, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-lg">{guideline.pollutant}</h3>
                      <Badge variant="outline" className="shrink-0">
                        {guideline.limit}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{guideline.health}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Health Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Reduce Outdoor Activities</h4>
                    <p className="text-sm text-muted-foreground">
                      Limit prolonged outdoor exertion when AQI is above 100, especially for
                      children and people with respiratory conditions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Use Air Purifiers</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider using HEPA air purifiers indoors when outdoor air quality is poor.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Stay Informed</h4>
                    <p className="text-sm text-muted-foreground">
                      Check air quality forecasts daily and plan outdoor activities accordingly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Wear Masks</h4>
                    <p className="text-sm text-muted-foreground">
                      N95 or equivalent masks can provide protection when AQI exceeds 150.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Keep Windows Closed</h4>
                    <p className="text-sm text-muted-foreground">
                      Prevent outdoor pollutants from entering your home during high pollution days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
