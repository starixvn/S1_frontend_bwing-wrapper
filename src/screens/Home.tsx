import { URL } from '@env';
import { SettingActions } from '@modules/setting';
import CookieManager from '@react-native-community/cookies';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Linking, Platform, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Share from 'react-native-share';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { CSSInjection } from 'src/utilities/scripts';
import { useDispatch } from 'react-redux';
import Error from '../common/Error';
import { useAppSelector } from 'src/store';
import { TOP_AREA_SPACE } from '../../lib/utilities';
import { space } from '../../lib/utilities/rn-helper';
import Loading from '../common/Loading';
import SplashScreen from './SplashScreen';

enum PostMessageType {
  NewWindow = 'NewWindow',
}

export const maintenanceUri = '/underMaintenance';

export const depositURL = [
  'DepositReqOnlineBanking',
  'DepositReqMobilePay',
  'DepositReqBankAutoChannel',
];
const share = [
  'Bwingtttt',
  'Bwingcsd',
  'www.youtube.com',
  'www.tiktok.com',
  'line.naver.j',
  'twitter.com',
  'zalo.me',
];

const Home = () => {
  const locale = useAppSelector(s => s.setting.locale);
  const dispatch = useDispatch();

  const [isSplashReady, setSplashReady] = useState(false);
  /* This is to hide some display before CSS is injected */
  const [isFirstLoadReady, setFirstLoadReady] = useState(false);
  const [url, setUrl] = useState(URL);

  function onSplashScreenReady() {
    setSplashReady(true);
  }

  const topSpace = TOP_AREA_SPACE;
  const navigation = useNavigation();
  const webRef = useRef(null);

  /* Notes 
    1. window.open doesnt work on android, hence need to overwrite the function to postMessage
       so we can handle at app layer
    2. 
  */

  const INJECTED_JAVASCRIPT = `
    setTimeout(() => {
      try {
        window.scroll({
          top: 0, 
          left: 0, 
          behavior: 'smooth'
        });
        /*  User agreed to use VN only for APP. */
        // const getlocale=document.querySelectorAll(".language img")[0].alt;
        // window.ReactNativeWebView.postMessage(getlocale);

        
        ${
          Platform.OS === 'android'
            ? ` window.open = function(url){
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    payload: url,
                    type: '${PostMessageType.NewWindow.toString()}'
                  }));
                  
                };`
            : ''
        }
      } catch(e){}
    },100);
    true;
  `;

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  const navChange = (e: WebViewNavigation) => {
    if (webRef.current) {
      webRef.current.injectJavaScript(INJECTED_JAVASCRIPT);
    }
  };

  const socialShare = (link: string) => {
    const ShareList = [
      {
        icon: 'facebook',
        shareOptions: {
          message: '',
          url: link,
          social: Share.Social.FACEBOOK,
        },
      },
      {
        icon: 'wa.me',
        shareOptions: {
          message: '',
          url: link,
          social: Share.Social.WHATSAPP,
        },
      },
      {
        icon: 't.me',
        shareOptions: {
          title: 'Share via',
          message: `${link}`,
          social: Share.Social.TELEGRAM,
        },
      },
    ];
    ShareList.filter((i, index) => {
      const check = link.includes(i.icon);

      if (check) {
        return Share.shareSingle(i.shareOptions);
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        webRef.current.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
      }}>
      {!(isSplashReady && isFirstLoadReady) && (
        <SplashScreen
          onSplashScreenReady={onSplashScreenReady}
          navigation={navigation}
        />
      )}
      <View
        style={{
          height: topSpace,
          paddingRight: space,
          backgroundColor: '#010e33',
        }}
      />
      <WebView
        ref={webRef}
        bounces={false}
        source={{
          uri: url,
        }}
        textZoom={100}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        injectedJavaScript={INJECTED_JAVASCRIPT + CSSInjection}
        injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
        onMessage={event => {
          try {
            const data = event.nativeEvent.data;
            if (data) {
              const parsed = JSON.parse(data);
              if (parsed.type === PostMessageType.NewWindow.toString()) {
                navigation.navigate('Others', {
                  url: URL + parsed.payload,
                });
              }
            }
          } catch (e) {
            console.log('failed to handle onMessage', e);
          }
        }}
        onLoadEnd={syntheticEvent => {
          // update component to be aware of loading status
          const { nativeEvent } = syntheticEvent;
          if (
            nativeEvent.url === URL + '/' ||
            nativeEvent.url.includes(maintenanceUri)
          ) {
            setFirstLoadReady(true);
          }
          // this.isLoading = nativeEvent.loading;
        }}
        startInLoadingState={true}
        onNavigationStateChange={e => {
          if (Platform.OS === 'ios') {
            navChange(e);
          }
        }}
        onLoadProgress={e => {
          if (Platform.OS === 'android' && e.nativeEvent.progress === 1) {
            navChange(e);
          }
        }}
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={e => {
          // overwrite default maintenance EN to VN
          if (e.url.includes(maintenanceUri + '/en')) {
            setUrl(
              e.url.replace(maintenanceUri + '/en', maintenanceUri + '/vn'),
            );
            return false;
          }

          //deposit checking
          const depositPage = depositURL.filter(i => e.url.includes(i));
          const errorPage = e.url.includes('error');
          //share checking
          const checked = share.filter(i => {
            return e.url.includes(i);
          });
          const fb = e.url.includes('facebook');
          const whatsapp = e.url.includes('wa.me');
          const telegram =
            e.url.includes('t.me') && !e.url.includes('Bwingcsd');
          const isShare = checked.length > 0 || fb || whatsapp || telegram;
          if (!isShare) {
            if (
              (e.url.startsWith(URL) &&
                depositPage.length <= 0 &&
                !errorPage) ||
              e.url === 'about:blank' ||
              e.url.startsWith('https://sc.detecas.com/') ||
              e.url.includes(maintenanceUri) ||
              e.url.startsWith('https://secure.livechatinc.com')
            ) {
              return true;
            } else {
              navigation.navigate('Others', { url: e.url });
              return false;
            }
          } else {
            if (checked.length > 0) {
              Linking.openURL(e.url);
              return false;
            } else {
              socialShare(e.url);
              return false;
            }
          }
        }}
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
      />
    </View>
  );
};

export default Home;
