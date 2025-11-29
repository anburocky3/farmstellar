"use client";

import {
  CloudRain,
  Droplets,
  Wind,
  AlertTriangle,
  Sun,
  Cloud,
} from "lucide-react";

export function WeatherAlertCard({ location = "Bangalore Rural, Karnataka" }) {
  const weatherData = {
    temperature: 24,
    condition: "Partly Cloudy",
    humidity: 65,
    rainfall: 30,
    windSpeed: 12,
    alert: "Light rain expected tomorrow - Good for planting!",
  };

  const getWeatherIcon = () => {
    if (weatherData.condition.includes("Cloudy")) {
      return <Cloud className="w-8 h-8 text-accent" />;
    } else if (weatherData.condition.includes("Rain")) {
      return <CloudRain className="w-8 h-8 text-accent" />;
    }
    return <Sun className="w-8 h-8 text-accent" />;
  };

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">
            Weather Alert
          </h3>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
        <div className="p-3 bg-accent/10 rounded-2xl">{getWeatherIcon()}</div>
      </div>

      {/* Temperature & Condition */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-primary">
            {weatherData.temperature}°
          </span>
          <span className="text-lg text-muted-foreground">C</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {weatherData.condition}
        </p>
      </div>

      {/* Weather Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-muted/30 rounded-xl p-3 text-center">
          <Droplets className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Humidity</p>
          <p className="text-sm font-bold text-foreground">
            {weatherData.humidity}%
          </p>
        </div>
        <div className="bg-muted/30 rounded-xl p-3 text-center">
          <CloudRain className="w-4 h-4 text-accent mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Rain</p>
          <p className="text-sm font-bold text-foreground">
            {weatherData.rainfall}%
          </p>
        </div>
        <div className="bg-muted/30 rounded-xl p-3 text-center">
          <Wind className="w-4 h-4 text-secondary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Wind</p>
          <p className="text-sm font-bold text-foreground">
            {weatherData.windSpeed} km/h
          </p>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-accent/10 border border-accent/30 rounded-2xl p-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-accent-foreground mb-1">
            Quick Alert
          </p>
          <p className="text-xs text-muted-foreground">{weatherData.alert}</p>
        </div>
      </div>
    </div>
  );
}
