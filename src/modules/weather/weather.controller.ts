import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Weather } from './open-weather-map.class';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) { /** */ }

  @Get()
  async getCurrentWeather(@Query() query: {
    latitude: number;
    longitude: number;
  }): Promise<{
      weather: Lowercase<Weather>,
      /** 섭씨 */
      degree: number,
      humidity: number,
      country: string;
    }> {
    return this.weatherService.getCurrentWeather(query);
  }
}
