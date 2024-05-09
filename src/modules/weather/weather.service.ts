import { Injectable } from '@nestjs/common';
import { OpenWeatherMap } from './open-weather-map.class';

@Injectable()
export class WeatherService {
  private readonly openWeatherMap = new OpenWeatherMap(process.env.WEATHER_MAP_API_KEY || '');

  async getCurrentWeather(params: Record<'latitude' | 'longitude', number>) {
    try {
      const { weather: [{ main: weather }], main, sys } = await this.openWeatherMap.getCurrentWeather(params);
      const { temp, humidity } = main;
      const { country } = sys;
      return {
        weather: weather.toLowerCase() as unknown as Lowercase<typeof weather>,
        /** 섭씨 */
        degree: temp - 273.15,
        humidity,
        country,
      };
    } catch {
      throw new Error('during request open weather api');
    }
  }
}
