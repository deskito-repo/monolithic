import { Type } from 'class-transformer';
import {
  IsBoolean, IsInt, IsString,
} from 'class-validator';

export class Config {
  readonly appName = 'nestjs-boilerplate';

  @IsString()
  readonly HOST: string = '0.0.0.0';

  @IsInt()
  @Type(() => Number)
  readonly PORT: number = 80;

  @IsString()
  readonly ENV: 'dev' | 'prod' = 'prod';

  @IsBoolean()
  get isDev() {
    return this.ENV === 'dev';
  }

  @IsBoolean()
  get isProd() {
    return this.ENV === 'prod';
  }

  @IsString()
  readonly TOKEN_SECRET: string;

  get serverHost() {
    return this.isDev ? `http://127.0.0.1:${this.PORT}` : process.env.SERVER_HOST;
  }
}
