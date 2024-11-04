import { Dimensions, PixelRatio, Platform } from 'react-native';
import { getVersion } from 'react-native-device-info';

// import { isTablet } from 'react-native-device-info';
function isTablet() {
  return false;
}
export const isTabletRatio = () => {
  /* dynamic width to adjust tablet view  */
  const initialLayout = Dimensions.get('window');
  // return isTablet() || initialLayout.height / initialLayout.width <= 1.6;
  return initialLayout.height / initialLayout.width <= 1.6;
};

const fontScale =
  Dimensions.get('window').width / (isTabletRatio() ? 600 : 375);

export const getScaledSize = (size: number) => {
  const newSize = size * fontScale;

  let newSizeInUnit = 0;
  if (Platform.OS === 'ios') {
    newSizeInUnit = Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    newSizeInUnit = Math.round(PixelRatio.roundToNearestPixel(newSize - 1));
  }
  return newSizeInUnit;
};

export const getFontSize = (size: number) => {
  // const maxScale = 1.1;
  // const balanceRatio = maxScale / PixelRatio.getFontScale();
  // const newSize = size * fontScale * balanceRatio;
  const newSize =
    (size *
      (Math.min(
        Dimensions.get('window').width,
        Dimensions.get('window').height,
      ) /
        (isTabletRatio() ? 600 : 420))) /
    PixelRatio.getFontScale();

  const newSizeInUnit = Math.round(PixelRatio.roundToNearestPixel(newSize));

  return newSizeInUnit;
};

export const space = getScaledSize(5);
export const SPACE_IN_SLOT = getScaledSize(5);

export const isFunction = (obj: any): obj is Function =>
  typeof obj === 'function';

export interface Version {
  major: number;
  minor: number;
  patch: number;
  iosUrl: string;
  androidUrl: string;
  changes: string[];
}

export function isNewVersionAvailable(remoteVersion: Version) {
  const currentVersion = getVersion();
  console.log('Remote version :', remoteVersion);
  const { major, minor, patch } = remoteVersion;
  const newVersionCode = major * 10000 + minor * 100 + patch;

  const [majorApp, minorApp, patchApp] = currentVersion.split('.');
  const currentVersionCode =
    parseInt(majorApp, 10) * 10000 +
    parseInt(minorApp, 10) * 100 +
    parseInt(patchApp, 10);

  return newVersionCode > currentVersionCode;
}
