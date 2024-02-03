const role = {
  PREMIUM: 3,
  /** Filled in additional information */
  VERIFIED: 1,
  /** only registered */
  NEWBIE: 0,
} as const;
export type RoleKey = keyof typeof role;
export type RoleValue = (typeof role)[keyof typeof role];
export type Role = RoleValue;
export {
  role,
};
