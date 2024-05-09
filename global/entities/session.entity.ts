import * as v from 'valibot';

export const sessionMeta = {
  id: {
    max: 20,
  },
};
export const session = v.object({
  id: v.string(),
  expiresAt: v.date(),
  userId: v.string(),
});

export type Session = v.Output<typeof session>;
