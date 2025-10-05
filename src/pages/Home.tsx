import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Satellite, Wind, Shield, BarChart3, Globe2, MapPin } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-sky py-24 md:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Satellite className="h-4 w-4 text-white" />
              <span className="text-sm text-white font-medium">NASA Space Apps Challenge 2025</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Earth in Your Hands
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Predicting Cleaner, Safer Skies with TEMPO
            </p>
            
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Monitor and forecast air quality in real-time using NASA's TEMPO satellite data,
              ground networks, and advanced weather modeling.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/map">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Air Quality
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20 backdrop-blur-sm">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* TEMPO Mission Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-fit p-3 bg-primary/10 rounded-2xl mb-2">
                  <Satellite className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl">About NASA TEMPO</CardTitle>
                <CardDescription className="text-base">
                  Tropospheric Emissions: Monitoring of Pollution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  TEMPO is NASA's first space-based instrument to monitor air quality over North America
                  on an hourly basis during daytime. Launched in 2023, it provides unprecedented
                  detail about air pollution and its sources.
                </p>
                <p>
                  The mission measures key pollutants including nitrogen dioxide (NO₂), ozone (O₃),
                  and formaldehyde at high spatial and temporal resolution, revolutionizing our
                  understanding of air quality dynamics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time monitoring and forecasting powered by satellite data and AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Interactive Map</CardTitle>
                <CardDescription>
                  Explore air quality data across the globe with toggleable pollution and weather layers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg group">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Smart Forecasting</CardTitle>
                <CardDescription>
                  7-day air quality predictions with interactive simulations for different scenarios
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg group">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Health Alerts</CardTitle>
                <CardDescription>
                  Get personalized warnings and recommendations based on WHO air quality guidelines
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wind className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multi-Pollutant Tracking</CardTitle>
                <CardDescription>
                  Monitor NO₂, PM2.5, Ozone, and other key air quality indicators in real-time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg group">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Satellite className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Satellite Integration</CardTitle>
                <CardDescription>
                  Combines TEMPO, Pandora network, and OpenAQ data for comprehensive coverage
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg group">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Custom Reports</CardTitle>
                <CardDescription>
                  Generate detailed PDF reports with location-specific data and health recommendations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-earth">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Start Monitoring Air Quality Today
            </h2>
            <p className="text-lg text-white/90">
              Take control of your environment with real-time data and forecasts
            </p>
            <Link to="/map">
              <Button size="lg" className="bg-white text-accent hover:bg-white/90 shadow-lg mt-4">
                <MapPin className="mr-2 h-5 w-5" />
                Launch Map Explorer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
