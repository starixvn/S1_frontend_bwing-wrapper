import { useCodePushDownload } from 'lib/hooks/useCodePushDownload';
import useSplashScreen from 'lib/hooks/useSplashScreen';
import { isTabletRatio, space } from 'lib/utilities/rn-helper';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { default as CodePush } from 'react-native-code-push';
import { getVersion } from 'react-native-device-info';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useDispatch } from 'react-redux';
import CodePushUpdateBar from 'src/components/CodePushUpdateBar';
import { checkVersionUpdated } from 'src/utilities/splashScreenChecks';
import BGImage from '../assets/images/splash_mobile.jpg';
import BGImageTablet from '../assets/images/splash_tablet.jpg';
import { HOME_NAV, RootStackParamList } from '../navigators';
import useLocalization from '@hooks/useLocalization';
import { Text, View } from 'native-base';

// type Props = StackScreenProps<RootStackParamList, 'SplashScreen'>;

function SplashScreen({ navigation, onSplashScreenReady }) {
  const currentVersion = getVersion();
  const { t } = useLocalization();
  const dispatch = useDispatch();
  const { status: codePushStatus, progress } = useCodePushDownload();
  const { status: splashScreenReady } = useSplashScreen(
    { mandatorySync: [checkVersionUpdated] },
    codePushStatus === CodePush.SyncStatus.UP_TO_DATE,
    {
      context: {
        dispatch,
        t,
        navigation,
      },
    },
  );

  useEffect(() => {
    console.log('SPLASHSCREEN - Ready', splashScreenReady);
    if (splashScreenReady) onSplashScreenReady();
    // navigation.reset({ index: 0, routes: [{ name: HOME_NAV }] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splashScreenReady]);

  return (
    <ImageBackground
      style={styles.root}
      imageStyle={styles.imageBackground}
      source={BGImage}>
      {/* <ForceUpdateModal isVisible={forceUpdate} detail={forceUpdateDetail} /> */}
      {/* <Image source={require('assets/images/main_logo.png')} /> */}
      <View style={styles.noteStyle}>
        <Text style={{ paddingBottom: space * 2 }} bold color={'white'}>
          {t('splashScreen.dear')}
        </Text>
        <Text style={{ textAlign: 'justify' }} bold color={'white'}>
          {t('splashScreen.note')}
        </Text>
      </View>

      {codePushStatus === CodePush.SyncStatus.DOWNLOADING_PACKAGE && (
        <CodePushUpdateBar
          progress={progress}
          style={styles.codePush}
          // bottom={sizes[7]}
          bottom={50}
        />
      )}
      <Text color="white" style={styles.cornerLabel}>
        {currentVersion}
      </Text>
    </ImageBackground>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    elevation: 1,
  },
  codePush: {
    position: 'absolute',
    left: 0,
    right: 0,
    marginHorizontal: isTabletRatio() ? '30%' : '20%',
  },
  cornerLabel: {
    position: 'absolute',
    bottom: getBottomSpace() || 10,
    right: getBottomSpace() || 10,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  noteStyle: {
    position: 'absolute',
    top: '17%',
    paddingHorizontal: space * 8,
  },
  imageBackground: {
    resizeMode: 'cover',
    height: '100%',
  },
});
