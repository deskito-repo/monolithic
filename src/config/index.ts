import { Transform } from 'class-transformer';
import {
  IsBoolean, IsInt, IsString,
} from 'class-validator';

export class Config {
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
}
