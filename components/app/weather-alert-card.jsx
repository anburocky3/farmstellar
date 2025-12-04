"use client";

import {
  CloudRain,
  Droplets,
  Wind,
  AlertTriangle,
  Sun,
  Cloud,
  CloudSnow,
  CloudDrizzle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function WeatherAlertCard({ location }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

        // Validate location
        if (!location || typeof location !== "string" || !location.trim()) {
          throw new Error("Location is required");
        }

        // Parse location - handle different formats
        const parts = location
          .trim()
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean);

        if (parts.length === 0) {
          throw new Error("Invalid location format");
        }

        // Use the first non-empty part (city/district)
        let queryLocation = parts[0];

        // If it's coordinates format (lat,lng), throw error
        if (/^-?\d+\.?\d*$/.test(queryLocation)) {
          throw new Error("Please provide a city name, not coordinates");
        }

        // Final validation - ensure we have a valid query
        if (!queryLocation || queryLocation.length < 2) {
          throw new Error("Location name is too short");
        }

        console.log("Fetching weather for:", queryLocation);

        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
          queryLocation
        )}&days=2&aqi=no&alerts=yes`;

        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Weather API error:", response.status, errorData);
          throw new Error(
            errorData.error?.message || `Unable to fetch weather data`
          );
        }

        const data = await response.json();
        console.log("Weather data received for:", data.location.name);

        setWeatherData({
          temperature: Math.round(data.current.temp_c),
          condition: data.current.condition.text,
          humidity: data.current.humidity,
          rainfall: data.forecast.forecastday[0].day.daily_chance_of_rain,
          windSpeed: Math.round(data.current.wind_kph),
          alert:
            data.alerts?.alert?.[0]?.headline ||
            `${data.forecast.forecastday[1].day.condition.text} expected tomorrow - Plan accordingly!`,
          icon: data.current.condition.icon,
          code: data.current.condition.code,
        });
        setLoading(false);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const getWeatherIcon = () => {
    if (!weatherData) return <Cloud className="w-8 h-8 text-accent" />;

    const condition = weatherData.condition.toLowerCase();
    if (condition.includes("rain") || condition.includes("drizzle")) {
      return <CloudRain className="w-8 h-8 text-accent" />;
    } else if (condition.includes("cloud")) {
      return <Cloud className="w-8 h-8 text-accent" />;
    } else if (condition.includes("snow")) {
      return <CloudSnow className="w-8 h-8 text-accent" />;
    } else if (condition.includes("sun") || condition.includes("clear")) {
      return <Sun className="w-8 h-8 text-accent" />;
    }
    return <Cloud className="w-8 h-8 text-accent" />;
  };

  if (loading) {
    return (
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="bg-card border-2 border-destructive/50 rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-3 text-destructive">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-bold">
              {t("dashboard.weather.unavailable")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error || t("dashboard.weather.unableToFetch")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">
            {t("dashboard.weather.title")}
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
          <p className="text-xs text-muted-foreground">
            {t("dashboard.weather.humidity")}
          </p>
          <p className="text-sm font-bold text-foreground">
            {weatherData.humidity}%
          </p>
        </div>
        <div className="bg-muted/30 rounded-xl p-3 text-center">
          <CloudRain className="w-4 h-4 text-accent mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">
            {t("dashboard.weather.rain")}
          </p>
          <p className="text-sm font-bold text-foreground">
            {weatherData.rainfall}%
          </p>
        </div>
        <div className="bg-muted/30 rounded-xl p-3 text-center">
          <Wind className="w-4 h-4 text-secondary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">
            {t("dashboard.weather.wind")}
          </p>
          <p className="text-sm font-bold text-foreground">
            {weatherData.windSpeed} km/h
          </p>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-accent/10 border border-accent/30 rounded-2xl p-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-accent-foreground mb-1">
            {t("dashboard.weather.quickAlert")}
          </p>
          <p className="text-xs text-muted-foreground">{weatherData.alert}</p>
        </div>
      </div>
    </div>
  );
}
