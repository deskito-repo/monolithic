import { Type } from 'class-transformer';
import {
  IsIn, IsString, IsInt,
} from 'class-validator';

const envEnum = ['dev', 'prod'] as const;
export class Config {
  @IsString()
  public readonly HOST = '0.0.0.0';

  public get host() {
    return this.HOST;
  }

  @IsInt()
  @Type(() => Number)
  public readonly PORT = 3000;

  public get port() {
    return this.PORT;
  }

  @IsIn(envEnum)
  public readonly env: typeof envEnum[number] = 'dev';

  public get isDev() {
    return this.env === 'dev';
  }

  public get isProd() {
    return this.env === 'prod';
  }

  public get serverHost() {
    return this.isDev ? `${this.host}:${this.port}` : '';
  }
}
