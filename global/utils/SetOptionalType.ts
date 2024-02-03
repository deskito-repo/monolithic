import {
  IntersectionType, OmitType, PartialType, PickType,
} from '@binochoi/nestjs-mapped-types';

// eslint-disable-next-line @typescript-eslint/ban-types
interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export const SetOptionalType = <T, K extends keyof T>(Entity: Type<T>, keys: K[]) => IntersectionType(
  PartialType(PickType(Entity, keys)),
  OmitType(Entity, keys),
);
