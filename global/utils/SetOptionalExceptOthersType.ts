import {
  IntersectionType, OmitType, PartialType, PickType,
} from '@binochoi/nestjs-mapped-types';
// eslint-disable-next-line @typescript-eslint/ban-types
interface Type<T = any> extends Function {
  new (...args: any[]): T;
}
/** set optional all props but except some props */
export const SetOptionalExceptOthersType = <T, K extends keyof T>(Entity: Type<T>, keys: K[]) => IntersectionType(
  PickType(Entity, keys),
  PartialType(OmitType(Entity, keys)),
);
