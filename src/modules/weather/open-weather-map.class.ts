export type Weather = 'Clear' /** clear sky */ | 'Rain' | 'Snow' | 'Clouds' | 'Thunderstorm' | 'Drizzle';
export class OpenWeatherMap {
  private readonly host = 'https://api.openweathermap.org';

  constructor(private readonly apiKey: string) { /** */ }

  async getCurrentWeather({ latitude: lat, longitude: lon }: {
    latitude: number;
    longitude: number;
  }): Promise<{
      coord: {
        lon: number;
        lat: number;
      },
      weather: {
        id: number;
        main: Weather;
        description: string;
        icon: string;
      }[],
      base: string;
      main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        presure: number;
        humidity: number;
      }
      wind: {
        speed: number;
        deg: number;
        gust: number;
      }
      sys: {
        /** @example 'KR' */
        country: string;
      }
    }> {
    const url = `${this.host}/data/2.5/weather?lat=${lat}&lon=${lon}&appId=${this.apiKey}`;
    const res = await fetch(url);
    return res.json();
  }
}
