import { Transform } from 'class-transformer';
import {
  IsBoolean, IsInt, IsString,
} from 'class-validator';

export class Config {
  public readonly appName = 'nestjs-boilerplate';

  @IsString()
  public readonly host: string = '0.0.0.0';

  @IsInt()
  @Transform(({ value }) => global.parseInt(value))
  public readonly port: number = 8080;

  @IsString()
  public readonly env: 'dev' | 'prod' = 'prod';

  @IsBoolean()
  public get isDev() {
    return this.env === 'dev';
  }

  @IsBoolean()
  public get isProd() {
    return this.env === 'prod';
  }

  @IsString()
  public readonly token_secret: string;

  public get serverHost() {
    return this.isDev ? `http://127.0.0.1:${this.port}` : process.env.SERVER_HOST;
  }
}
