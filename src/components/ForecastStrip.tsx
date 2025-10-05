import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DailyForecast {
  date: string;
  max_temp: number;
  min_temp: number;
  condition: string;
  condition_icon: string;
  precipitation_chance: number;
  humidity: number;
}

interface ForecastStripProps {
  forecast: DailyForecast[];
}

export const ForecastStrip = ({ forecast }: ForecastStripProps) => {
  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">7-Day Forecast</h3>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-32 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all"
              >
                <div className="text-center space-y-2">
                  <div className="font-semibold text-sm">
                    {getDayName(day.date)}
                  </div>
                  <img
                    src={`https:${day.condition_icon}`}
                    alt={day.condition}
                    className="w-12 h-12 mx-auto"
                  />
                  <div className="text-xs text-muted-foreground">
                    {day.condition}
                  </div>
                  <div className="flex justify-center items-center space-x-2">
                    <span className="text-lg font-bold">
                      {Math.round(day.max_temp)}°
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(day.min_temp)}°
                    </span>
                  </div>
                  <div className="text-xs text-blue-500">
                    💧 {day.precipitation_chance}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
