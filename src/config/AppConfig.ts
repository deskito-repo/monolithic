import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export default class AppConfig {
  @IsString()
  public readonly host: string;

  @IsInt()
  @Transform(({ value }) => global.parseInt(value), { toClassOnly: true })
  public readonly port: number;

  @IsString()
  public readonly env: 'dev' | 'prod';

  @IsBoolean()
  public get isDev() {
    return this.env === 'dev';
  }

  @IsBoolean()
  public get isProd() {
    return this.env === 'prod';
  }
}
