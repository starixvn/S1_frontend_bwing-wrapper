import {
  SplashScreenContext,
  SplashScreenHandler,
} from '@hooks/useSplashScreen';
import { AlertActions } from '@modules/alert';
import firestore from '@react-native-firebase/firestore';
import { isNewVersionAvailable, Version } from '@utilities/rn-helper';
import { Linking, Platform } from 'react-native';

export function checkVersionUpdated(
  context: SplashScreenContext,
): () => Promise<SplashScreenHandler> {
  return async () => {
    const { dispatch, t } = context;

    const versions = await firestore().collection('versions').get();
    const latestVersion = (await versions.docs[
      versions.docs.length - 1
    ].data()) as Version;

    const isUptoDate = !isNewVersionAvailable(latestVersion);

    console.log('SPLASHSCREEN - binary version status', isUptoDate);

    const { major, minor, patch } = latestVersion;

    return {
      result: isUptoDate,
      handler: () => {
        if (!isUptoDate)
          dispatch(
            AlertActions.addAlert({
              title: t('forceDownload.title', {
                version: `${major}.${minor}.${patch}`,
              }),
              message: latestVersion.changes.reduce(
                (c, s) => `${c}- ${s}\n`,
                '',
              ),
              actions: [
                {
                  label: t('forceDownload.download'),
                  onPress: () => {
                    try {
                      Linking.openURL(
                        Platform.OS === 'android'
                          ? latestVersion.androidUrl
                          : latestVersion.iosUrl,
                      );
                    } catch (e) {}
                  },
                  disableAutoClose: true,
                },
              ],
              persistent: true,
              hideCloseButton: true,
            }),
          );
      },
    };
  };
}

// export function checkMaintenance(
//   context: SplashScreenContext,
// ): () => Promise<SplashScreenHandler> {
//   return async () => {
//     const {dispatch, navigation} = context;
//     let isMaintenance = false;

//     try {
//       const result = await dispatch(bannerApi.endpoints.banners.initiate('vn'));

//       isMaintenance = result.error?.httpResponse?.status === 403;
//     } catch (e) {
//       console.log('failed to check for maintenance', e);
//     }

//     console.log('SPLASHSCREEN - maintenance status', isMaintenance);
//     return {
//       result: !isMaintenance,
//       handler: () => {
//         if (isMaintenance) {
//           navigation.navigate('MaintenancePage');
//         }
//       },
//     };
//   };
// }
