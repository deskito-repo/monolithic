import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import AppConfig from './AppConfig';

export class Config {
    @Type(() => AppConfig)
    @ValidateNested()
  public readonly app: AppConfig;
}
