type RoleKey = 'ADMIN' | 'STAFF' | 'NORMAL';
export type RoleValue = 1 | 2 | 3;
export type Role = RoleValue;

export const role = {
  ADMIN: 1,
  STAFF: 2,
  NORMAL: 3,
} as Record<RoleKey, RoleValue>;

export type SocialProviderKey = 'GOOGLE' | 'KAKAO';
type SocialProviderValue = 1 | 2;
export type SocialProvider = SocialProviderValue;

export const socialProvider = {
  GOOGLE: 1,
  KAKAO: 2,
} satisfies Record<SocialProviderKey, SocialProviderValue>;

export interface User {
    id: number;
    userId: string;
    nickname: string;
    name: string;
    role: Role;
    phoneNumber: string;
    signUpDate: Date;
    socialProvider: SocialProvider | null;
    password: string;
}

export const schema = {
  userId: {
    min: 5,
    max: 25,
  },
  nickname: {
    min: 4,
    max: 15,
  },
  name: {
    min: 2,
    max: 6,
  },
  password: {
    min: 8,
    max: 30,
  },
  phoneNumber: {
    min: 11,
    max: 20,
  },
} satisfies Partial<Record<keyof User, {
  min: number;
  max: number;
}>>;
