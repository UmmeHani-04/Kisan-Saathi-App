import { useState } from "react";
import type { FormEvent } from "react";
import { CloudRain, CloudSun, Droplets, LoaderCircle, Search, Sun, Wind } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/siteLanguage";
import VoiceInput from "@/components/VoiceInput";

type GeocodingResult = {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

type ForecastDay = {
  date: string;
  weatherCode: number;
  maxTemperature: number;
  minTemperature: number;
  rainProbability: number;
  windSpeed: number;
  humidity?: number;
};

type CurrentWeather = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  sunrise?: string;
  sunset?: string;
};

function getWeatherIcon(code: number) {
  if (code >= 51 && code <= 99) return CloudRain;
  if (code >= 1 && code <= 3) return CloudSun;
  return Sun;
}

function getWeatherLabel(code: number, t: ReturnType<typeof useLanguage>["t"]) {
  const key =
    code === 0
      ? "clearSky"
      : code === 1
        ? "mainlyClear"
        : code === 2
          ? "partlyCloudy"
          : code === 3
            ? "overcast"
            : code === 45 || code === 48
              ? "foggy"
              : code === 51
                ? "lightDrizzle"
                : code === 53
                  ? "drizzle"
                  : code === 55
                    ? "heavyDrizzle"
                    : code === 61
                      ? "lightRain"
                      : code === 63
                        ? "rainCondition"
                        : code === 65
                          ? "heavyRain"
                          : code === 71
                            ? "lightSnow"
                            : code === 73
                              ? "snow"
                              : code === 75
                                ? "heavySnow"
                                : code === 80 || code === 81
                                  ? "rainShowers"
                                  : code === 82
                                    ? "heavyShowers"
                                    : code === 95
                                      ? "thunderstorm"
                                      : code === 96 || code === 99
                                        ? "thunderstormHail"
                                        : "variableConditions";
  return t(key);
}

function getFarmingTip(day: ForecastDay, t: ReturnType<typeof useLanguage>["t"]) {
  if (day.rainProbability >= 60) {
    return t("rainTip");
  }
  if (day.maxTemperature >= 35) {
    return t("heatTip");
  }
  if (day.windSpeed >= 25) {
    return t("windTip");
  }
  return t("routineTip");
}

function formatDay(date: string, language: string) {
  return new Intl.DateTimeFormat(
    language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    },
  ).format(new Date(`${date}T12:00:00`));
}

export default function WeatherSection() {
  const { language, t } = useLanguage();
  const [place, setPlace] = useState("");
  const [location, setLocation] = useState<GeocodingResult | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchWeather(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = place.trim();
    if (!query) {
      setError(t("forecastPrompt"));
      return;
    }

    setLoading(true);
    setError("");
    try {
      const geocodingResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`,
      );
      if (!geocodingResponse.ok) throw new Error("Location search failed");
      const geocodingData: { results?: GeocodingResult[] } = await geocodingResponse.json();
      const result = geocodingData.results?.[0];
      if (!result) {
        setForecast([]);
        setLocation(null);
        setCurrent(null);
        setError("We could not find that place. Try a nearby town or district.");
        return;
      }

      const forecastResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}&longitude=${result.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset&forecast_days=5&timezone=auto`,
      );
      if (!forecastResponse.ok) throw new Error("Forecast request failed");
      const forecastData = await forecastResponse.json();
      const daily = forecastData.daily;
      if (
        !daily?.time ||
        !daily.weather_code ||
        !daily.temperature_2m_max ||
        !daily.temperature_2m_min ||
        !daily.precipitation_probability_max ||
        !daily.wind_speed_10m_max
      ) {
        throw new Error("Forecast data was incomplete");
      }

      setLocation(result);
      setForecast(
        daily.time.map((date: string, index: number) => ({
          date,
          weatherCode: daily.weather_code[index],
          maxTemperature: Math.round(daily.temperature_2m_max[index]),
          minTemperature: Math.round(daily.temperature_2m_min[index]),
          rainProbability: daily.precipitation_probability_max[index],
          windSpeed: Math.round(daily.wind_speed_10m_max[index]),
        })),
      );
      setCurrent({
        temperature: Math.round(forecastData.current?.temperature_2m),
        humidity: Math.round(forecastData.current?.relative_humidity_2m),
        windSpeed: Math.round(forecastData.current?.wind_speed_10m),
        weatherCode: forecastData.current?.weather_code,
        sunrise: daily.sunrise?.[0],
        sunset: daily.sunset?.[0],
      });
    } catch (requestError) {
      console.error("Weather lookup failed:", requestError);
      setForecast([]);
      setLocation(null);
      setCurrent(null);
      setError(t("weatherUnavailable"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" id="weather">
      <div className="section-heading">
        <span className="eyebrow">{t("weatherUpdates")}</span>
        <h2>{t("planWeather")}</h2>
        <p>{t("weatherDescription")}</p>
      </div>

      <Card className="mx-auto max-w-5xl border-border/70 shadow-md">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CloudSun className="size-5 text-primary" aria-hidden="true" />
            {t("localForecast")}
          </CardTitle>
          <form onSubmit={searchWeather} className="flex flex-col gap-3 pt-2 sm:flex-row">
            <div className="flex min-w-0 flex-1 gap-2">
              <Input
                value={place}
                onChange={(event) => setPlace(event.target.value)}
                placeholder={t("locationPlaceholder")}
                aria-label={t("locationPlaceholder")}
                className="h-11"
              />
              <VoiceInput value={place} onChange={setPlace} />
            </div>
            <Button type="submit" className="h-11 shrink-0" disabled={loading}>
              {loading ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Search className="size-4" aria-hidden="true" />
              )}
              {t("searchWeather")}
            </Button>
          </form>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          {error && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          )}
          {!location && !error && (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("enterLocation")}</p>
          )}
          {location && forecast.length > 0 && (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {location.name}
                {location.admin1 ? `, ${location.admin1}` : ""}
                {location.country ? `, ${location.country}` : ""}
              </p>
              {current && (
                <div className="weather-current-grid">
                  <article>
                    <strong>{current.temperature}°C</strong>
                    <span>{getWeatherLabel(current.weatherCode, t)}</span>
                  </article>
                  <article>
                    <strong>{current.humidity}%</strong>
                    <span>{t("humidity")}</span>
                  </article>
                  <article>
                    <strong>{current.windSpeed} km/h</strong>
                    <span>{t("wind")}</span>
                  </article>
                  {current.sunrise && (
                    <article>
                      <strong>
                        {new Date(current.sunrise).toLocaleTimeString(
                          language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </strong>
                      <span>{t("sunrise")}</span>
                    </article>
                  )}
                </div>
              )}
              {current && (
                <div className="weather-alerts">
                  {forecast[0].rainProbability >= 60 && (
                    <p role="status">⚠️ {t("heavyRainAlert")}</p>
                  )}
                  {current.temperature >= 35 && <p role="status">☀️ {t("heatAlert")}</p>}
                  {current.windSpeed >= 25 && <p role="status">💨 {t("windAlert")}</p>}
                  {forecast[0].rainProbability < 60 &&
                    current.temperature < 35 &&
                    current.windSpeed < 25 && <p role="status">🌿 {t("weatherGoodForWork")}</p>}
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {forecast.map((day) => {
                  const Icon = getWeatherIcon(day.weatherCode);
                  return (
                    <article key={day.date} className="rounded-xl border bg-background p-4">
                      <p className="text-sm font-semibold text-foreground">
                        {formatDay(day.date, language)}
                      </p>
                      <Icon className="my-3 size-8 text-primary" aria-hidden="true" />
                      <p className="text-sm text-muted-foreground">
                        {getWeatherLabel(day.weatherCode, t)}
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        {day.maxTemperature}°{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          / {day.minTemperature}°
                        </span>
                      </p>
                      <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1.5">
                          <Droplets className="size-3.5" /> {t("rain")} {day.rainProbability}%
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Wind className="size-3.5" /> {t("wind")} {day.windSpeed} km/h
                        </p>
                      </div>
                      <p className="mt-3 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
                        {getFarmingTip(day, t)}
                      </p>
                    </article>
                  );
                })}
              </div>
            </>
          )}
          <p className="mt-5 text-xs text-muted-foreground">{t("weatherCredit")}</p>
        </CardContent>
      </Card>
    </section>
  );
}
