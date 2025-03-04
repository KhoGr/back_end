export const ACCOUNT_TYPES = {
  LOCAL: 'local',
  GOOGLE: 'gg',
  FACEBOOK: 'fb',
};

export const COOKIE_EXPIRES_TIME = 7 * 24 * 3600 * 1000; // 7 days (by sec)

export const JWT_EXPIRES_TIME = 7 * 24 * 3600 * 1000; // 7 days (by sec)

export const KEYS = {
  JWT_TOKEN: 'token',
};

export const MAX = {
  SIZE_JSON_REQUEST: '25mb',
  EMAIL_LEN: 100,
  PASSWORD_LEN: 40,
  NAME_LEN: 50,
  USER_NAME: 110,
  LEN_WORD_PACK: 500,
  FAVORITES_LEN: 200,
  VERIFY_CODE: 6,
  USER_COIN: 999_999_999,
  VERIFY_TIME: 10 * 60 * 1000, // 10 minutes
};

export const DEFAULT = {
  USER_COIN: 100,
};

export const MIN = {
  PASSWORD_LEN: 6,
  CONFUSING_LIST: 20,
};

export const NUM_OF_TOPICS = 30;

export const NUM_OF_SPECIALTY = 30;

// 🎯 Thêm quyền (Role)
export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  SELLER: 'seller',
};
