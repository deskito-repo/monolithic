export const userValidation = {
  userId: {
    min: 5,
    max: 20,
    matches: {
      default: /^[a-z][a-z0-9]+$/,
    },
  },
  nickname: {
    min: 2,
    max: 10,
  },
  password: {
    min: 8,
    max: 25,
    matches: {
      default: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/,
    },
  },
  name: {
    min: 2,
    max: 10,
  },
  phoneNumber: {
    max: 20,
    min: 10,
  },
};
