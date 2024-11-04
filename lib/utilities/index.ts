import Clipboard from '@react-native-clipboard/clipboard';
import dayjs from 'dayjs';
import {Platform} from 'react-native';
import {getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper';
import {getScaledSize} from './rn-helper';

export const NAVIGATION_HEIGHT =
  Platform.OS === 'ios'
    ? getStatusBarHeight(true) + getScaledSize(50)
    : getScaledSize(50);
export const BOTTOM_SAFE_AREA_SPACE = isIphoneX() ? 15 : 0;
export const FOOTER_HEIGHT = NAVIGATION_HEIGHT + BOTTOM_SAFE_AREA_SPACE;
export const HEADER_HEIGHT = NAVIGATION_HEIGHT;
export const TOP_AREA_SPACE =
  Platform.OS === 'ios' ? getStatusBarHeight(true) : 0;

// Constant for Axios in ms
export const REFRESH_INTERVAL = 5000;

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function copyToClipboard(
  message: string,
  onCopied?: (msg: string) => void,
) {
  Clipboard.setString(message);
  onCopied && onCopied(message);
  // SimpleToast.show(t('common.copied', { message }), SimpleToast.SHORT);
}

export function humanFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0KB';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    ((bytes / 1024 ** i) * 1).toFixed(2) +
    ' ' +
    ['B', 'KB', 'MB', 'GB', 'TB'][i]
  );
}

export function sumAmountSafe(a: number, b: number): number {
  return (a * 1000 + b * 1000) / 1000;
}

export function isFalsyValue(val: unknown): boolean {
  return val === undefined || val === null || val === '';
}
