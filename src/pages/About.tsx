import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Satellite, Database, Users, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 space-y-4 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold">About This Project</h1>
          <p className="text-lg text-muted-foreground">
            Built for NASA Space Apps Challenge 2025
          </p>
        </div>

        <div className="space-y-6">
          {/* Challenge Background */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-6 w-6 text-primary" />
                <CardTitle>Challenge Background</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Theme: Predicting Cleaner, Safer Skies with TEMPO</h3>
                <p className="text-muted-foreground">
                  This project was created for the NASA Space Apps Challenge 2025, which challenges
                  teams to leverage NASA's TEMPO satellite data to build innovative solutions for
                  air quality monitoring and forecasting. Our goal is to make satellite-based air
                  quality data accessible and actionable for everyone.
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Datasets & APIs */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-6 w-6 text-primary" />
                <CardTitle>Data Sources</CardTitle>
              </div>
              <CardDescription>
                This platform integrates multiple authoritative data sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold">NASA TEMPO</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tropospheric Emissions: Monitoring of Pollution - Hourly air quality
                        measurements from geostationary orbit covering North America
                      </p>
                    </div>
                    <Badge>Satellite</Badge>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold">Pandora Network</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ground-based spectrometer network providing validation data for satellite
                        measurements and local pollutant concentrations
                      </p>
                    </div>
                    <Badge variant="outline">Ground Network</Badge>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold">OpenAQ</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Global air quality data aggregator combining government monitoring stations
                        and research-grade sensors worldwide
                      </p>
                    </div>
                    <Badge variant="secondary">Global Network</Badge>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold">Weather Data</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Meteorological data including temperature, humidity, wind speed, and
                        atmospheric conditions affecting pollutant dispersion
                      </p>
                    </div>
                    <Badge variant="outline">Meteorological</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Satellite className="h-6 w-6 text-primary" />
                <CardTitle>Technology Stack</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="outline">Leaflet.js</Badge>
                <Badge variant="outline">Recharts</Badge>
                <Badge variant="outline">Shadcn UI</Badge>
                <Badge variant="outline">Vite</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Team Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>Team Omnipresence</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  Ricky Bahadur Khulal
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  Aaryawart Bhandari
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  Ajay Kumar Mehta
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  Siddhi Karki
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  Sakshyam Nepal
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Mission & Vision */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-6 w-6 text-primary" />
                <CardTitle>Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                To democratize access to satellite-based air quality data and empower individuals,
                communities, and policymakers to make informed decisions about their environmental
                health.
              </p>
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="font-semibold mb-2">For Individuals</h4>
                  <p className="text-sm text-muted-foreground">
                    Understand local air quality, receive health alerts, and plan outdoor
                    activities safely.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">For Communities</h4>
                  <p className="text-sm text-muted-foreground">
                    Track pollution trends, identify sources, and advocate for cleaner air
                    policies.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">For Researchers</h4>
                  <p className="text-sm text-muted-foreground">
                    Access integrated datasets for air quality research and climate studies.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">For Policymakers</h4>
                  <p className="text-sm text-muted-foreground">
                    Use data-driven insights to develop effective environmental regulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none">
            <CardContent className="pt-6">
              <p className="text-center text-sm text-muted-foreground">
                This is a demonstration platform created for educational purposes. Real API
                integrations and live data feeds are planned for future development.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
