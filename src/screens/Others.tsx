import { useRoute } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import WebView, { WebViewNavigation } from 'react-native-webview';
import Error from '../common/Error';
import { useOrientationChange } from '../../lib/hooks/useOrientationChange';
import { NAVIGATION_HEIGHT, TOP_AREA_SPACE } from '../../lib/utilities';
import { getScaledSize, space } from '../../lib/utilities/rn-helper';
import Loading from '../common/Loading';
import { depositURL } from './Home';
import { URL } from '@env';

const portraitScreen = [
  ...depositURL,
  'aff.bwing.com',
  'direct.lc.chat',
  'FAQ.html',
];

const INJECTED_JAVASCRIPT = `window.addEventListener('load', function () {
  setTimeout(() => {
    const ori = InterfaceControllerMobile_2.prototype.Pressed_Home;
    InterfaceControllerMobile_2.prototype.Pressed_Home = function (args) {
      ori();
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'BACK' }));
    };
  },5000)
})
window.close = function () {
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'BACK' }));
};
true;`;

const Others = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const [orientation, setOrientation] = useState<string>('PORTRAIT');
  const isLandscape =
    orientation.includes('LANDSCAPE-RIGHT') ||
    orientation.includes('LANDSCAPE-LEFT');
  const topSpace = isLandscape ? TOP_AREA_SPACE / 3 : TOP_AREA_SPACE + 10;
  const leftSpace = isLandscape ? -getScaledSize(15) : 0;
  const headerHeight = isLandscape ? NAVIGATION_HEIGHT / 2 : NAVIGATION_HEIGHT;

  const portraitURL = portraitScreen.filter(i => {
    return params?.url?.includes(i);
  });

  const isPortraitPage = portraitURL.length > 0;

  useOrientationChange((o: string) => {
    setOrientation(o);

    Orientation.getAutoRotateState(isAbleToRotate => {
      if (isPortraitPage) {
        return;
      }

      if (isAbleToRotate) {
        Orientation.unlockAllOrientations();
        return;
      }

      Orientation.lockToPortrait();
    });
  });

  useEffect(() => {
    if (!isPortraitPage) {
      Orientation.unlockAllOrientations();
    }

    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  function onMessage(event) {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data) {
        const { type } = data;
        switch (type) {
          case 'BACK':
            triggerNavigateBack();
            break;

          default:
            break;
        }
      }
    } catch (e) {
      console.log('onMessage error', e);
    }
  }

  const checkShouldNavigateBack = ({ url }: { url: string }) => {
    const depositPage = depositURL.filter(i => url.includes(i));
    if (
      url.startsWith(URL) &&
      !url.includes('entPage') &&
      depositPage.length <= 0
    ) {
      return true;
    }
    return false;
  };

  const triggerNavigateBack = () => {
    try {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      navigation.navigate('Home');
    } catch (error) {
      console.log('triggerNavigateBack error', error);
    }
  };

  const onBackScreen = (e: WebViewNavigation) => {
    const isShouldNavigateBack = checkShouldNavigateBack(e);
    if (isShouldNavigateBack) {
      triggerNavigateBack();
      return false;
    }
  };
  return (
    <View
      style={{
        backgroundColor: '#010e33',
        flex: 1,
      }}>
      <View
        style={{
          height: headerHeight,
          paddingRight: space,
          backgroundColor: '#010e33',
          flexDirection: 'row',
          marginLeft: leftSpace,
        }}>
        <View
          style={[
            styles.backBtn,
            {
              paddingTop: topSpace,
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={require('../assets/images/arrow-left-icon.png')}
              style={{ height: getScaledSize(20), width: getScaledSize(20) }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.7 }} />
      </View>
      <WebView
        source={{ uri: params.url }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onMessage={event => {
          onMessage(event);
        }}
        startInLoadingState={true}
        sharedCookiesEnabled
        scalesPageToFit
        bounces={false}
        renderLoading={() => <Loading />}
        renderError={(errorDomain, errorCode, errorDesc) => {
          return (
            <Error
              errorCode={errorCode}
              errorDomain={errorDomain}
              errorDesc={errorDesc}
            />
          );
        }}
        onShouldStartLoadWithRequest={e => {
          if (e) onBackScreen(e);
          return true;
        }}
        onNavigationStateChange={e => {
          if (e) onBackScreen(e);
        }}
      />
    </View>
  );
};

export default Others;

const styles = StyleSheet.create({
  backBtn: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
