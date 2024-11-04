import {useEffect, useState} from 'react';
import codePush, {DownloadProgress} from 'react-native-code-push';

export function useCodePushDownload(
  onCodePushUpdateFailed?: () => void,
  options?: {autoDownload: boolean; mandatory: boolean},
) {
  const {autoDownload = true, mandatory = true} = options || {};
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<codePush.SyncStatus>();

  function onDownloadProgress({totalBytes, receivedBytes}: DownloadProgress) {
    console.log('downloading', receivedBytes, '/ ', totalBytes);
    setProgress(receivedBytes / totalBytes);
  }

  // async function tryForceDownloadPackage(stats) {
  //   // This is to force update the release
  // }

  async function syncStatus() {
    const stats = await codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
      },
      codePushStats => {
        // stats will be UP_TO_DATE if previously failed to install, do not update status if its 0
        if (codePushStats !== codePush.SyncStatus.UP_TO_DATE) {
          setStatus(codePushStats);
        }

        if (codePushStats === codePush.SyncStatus.UNKNOWN_ERROR) {
          // Temporarily by pass code push if error download , waiting infra fix the delay
          if (onCodePushUpdateFailed) onCodePushUpdateFailed();
        }
      },
      onDownloadProgress,
    );

    // stats will be UP_TO_DATE if previously failed to install, do not update status if its 0
    if (stats !== codePush.SyncStatus.UP_TO_DATE) setStatus(stats);

    const availableUpdate = await codePush.checkForUpdate();
    if (availableUpdate) {
      setStatus(codePush.SyncStatus.DOWNLOADING_PACKAGE);
      const downloadedPackage = await availableUpdate.download(
        onDownloadProgress,
      );
      downloadedPackage.install(codePush.InstallMode.IMMEDIATE);
    } else if (stats === codePush.SyncStatus.UPDATE_INSTALLED) {
      codePush.restartApp();
    }

    console.log('syncStatus', stats);
    console.log('availableUpdate', availableUpdate);
  }

  useEffect(() => {
    async function codePushChecking() {
      const isNewPackageAvailable = await checkCodePushDownloadable(mandatory);
      if (isNewPackageAvailable) {
        if (autoDownload) syncStatus();
        else setStatus(codePush.SyncStatus.AWAITING_USER_ACTION);
      } else {
        console.log('Set Code Push Up To Date');
        codePush.notifyAppReady();
        setStatus(codePush.SyncStatus.UP_TO_DATE);
      }
    }

    try {
      codePushChecking();
    } catch (e) {
      console.log('useCodePushDownload error', e);
    }
  }, []);

  return {progress, status, download: syncStatus};
}

export async function checkCodePushDownloadable(
  isMandatory = true,
): Promise<boolean> {
  try {
    if (__DEV__) return false;

    const remotePackage = await codePush.checkForUpdate();
    console.log('remotePackage', remotePackage);
    if (remotePackage != null && (!isMandatory || remotePackage.isMandatory)) {
      return true;
    }
  } catch (e) {
    console.log('onStartScreenValidation', e);
  }

  return false;
}
