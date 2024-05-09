const role = {
  PREMIUM: 3,
  VERIFIED: 1,
  /** only simply registered */
  NEWBIE: 0,
} as const;
export type RoleKey = keyof typeof role;
export type RoleValue = (typeof role)[keyof typeof role];
export type Role = RoleValue;
export {
  role,
};
