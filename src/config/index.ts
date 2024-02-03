import { Type } from 'class-transformer';
import {
  IsBoolean, IsInt, IsString,
} from 'class-validator';

export class Config {
  public readonly appName = 'nestjs-boilerplate';

  @IsString()
  private readonly Host: string = '0.0.0.0';

  public get host() {
    return this.Host;
  }

  @IsInt()
  @Type(() => Number)
  private readonly PORT: number = 80;

  public get port() {
    return this.PORT;
  }

  @IsString()
  public readonly ENV: 'dev' | 'prod' = 'prod';

  @IsBoolean()
  public get isDev() {
    return this.ENV === 'dev';
  }

  @IsBoolean()
  public get isProd() {
    return this.ENV === 'prod';
  }

  @IsString()
  public readonly TOKEN_SECRET: string;

  public get serverHost() {
    return this.isDev ? `http://127.0.0.1:${this.port}` : process.env.SERVER_HOST;
  }
}
