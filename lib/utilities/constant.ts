export const currencyListMapper: { [key: number]: string } = {
  2: 'MYR',
  4: 'THB',
  13: 'RMB',
  15: 'IDR',
  51: 'VND',
};

export enum Currency {
  MYR = 2,
  THB = 4,
  RMB = 13,
  IDR = 15,
  VND = 51,
  CRYPTO = 96,
}

export enum LANGUAGE_CODE {
  ENGLISH = 'en',
  VIETNAM = 'vn',
}

// Promotion
export const STATUS_RUNNING = 1;
export const STATUS_CANCELLED = 2;
export const STATUS_FULFILLED = 4;
export const STATUS_TRANSFER_OUT = 5;