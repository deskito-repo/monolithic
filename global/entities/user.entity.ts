import {
  object, string, type Output, maxLength, minLength, regex, picklist, date,
  nullable,
} from 'valibot';
import { socialProvider } from 'global/enums/SocialProvider';
import { role } from 'global/enums/UserRole';
import * as t from 'global/i18n/validations/en';

export const userMeta = {
  id: {
    min: 5,
    max: 20,
  },
  nickname: {
    min: 2,
    max: 10,
  },
  password: {
    min: 8,
    max: 25,
  },
};
const { id, nickname, password } = userMeta;
export const user = object({
  id: string([
    minLength(id.min),
    maxLength(id.max),
    regex(/^[a-z][a-z0-9]+$/),
  ]),
  nickname: string([
    minLength(nickname.min),
    maxLength(nickname.max),
    regex(/^[a-z][a-z0-9]+$/),
  ]),
  password: nullable(
    string(t.illegalPassword, [
      minLength(password.min, t.illegalPassword),
      maxLength(password.max, t.illegalPassword),
      regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/, t.illegalPassword),
    ]),
  ),
  role: picklist(Object.values(role)),
  socialProvider: nullable(picklist(Object.values(socialProvider))),
  createdAt: date(),
  latestAccessAt: date(),
});

export type User = Output<typeof user>;
