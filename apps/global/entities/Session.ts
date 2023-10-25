import { Role, schema as userSchema } from './User';

export interface Session {
    id: number;
    userId: string;
    role: Role;
    expires: Date;
}

export const schema = {
  userId: userSchema.userId,
} satisfies Partial<Record<keyof Session, {
  min: number;
  max: number;
}>>;
