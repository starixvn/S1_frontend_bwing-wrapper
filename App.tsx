import { PersistGate } from 'redux-persist/integration/react';
import { NativeBaseProvider } from 'native-base';
import React, { useEffect } from 'react';
import { Alert, Platform, StatusBar, View } from 'react-native';
import RootNavigator from './src/navigators';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@hooks/useLocalization';
import store, { useAppSelector, persistor } from './src/store';
import i18n from './src/assets/locales';
import { isEmulator } from 'react-native-device-info';
import AlertModal from 'src/components/modal/AlertModal';
import theme from 'theme';
const App = () => {
  const locale = useAppSelector(s => s.setting.locale);

  async function configureNotification() {
    const authStatus = await messaging().requestPermission();
    const token = await messaging().getToken();

    messaging().subscribeToTopic('ALL');
    PushNotification.createChannel(
      {
        channelId: 'global', // (required)
        channelName: 'Global', // (required)
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        const { messageId, notification, data } = remoteMessage;
        const id = messageId as string;
        const body = notification && (notification.body as string);
        const title = notification && (notification.title as string);
        const msg = body as string;

        if (Platform.OS === 'ios') {
          const img = data && data.fcm_options && data.fcm_options.image;
          PushNotificationIOS.addNotificationRequest({
            id,
            body,
            title,
            userInfo: { image: img },
          });
        } else {
          const img = notification && notification.android.imageUrl;
          PushNotification.localNotification({
            channelId: 'global',
            message: msg,
            title,
            largeIconUrl: img,
          });
        }
      }

      return unsubscribe;
    });
  }

  useEffect(() => {
    configureNotification();
  }, []);

  return (
    <NativeBaseProvider
      theme={theme}
      config={{ suppressColorAccessibilityWarning: true }}>
      <LocalizationProvider locale={locale} i18n={i18n}>
        <StatusBar barStyle="light-content" backgroundColor={'#010e33'} />
        <RootNavigator />
        <AlertModal />
      </LocalizationProvider>
    </NativeBaseProvider>
  );
};

const ReduxApp =
  <P extends object>(Component: React.ComponentType<P>): React.FC<P> =>
  ({ ...props }) =>
    (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...props} />
        </PersistGate>
      </Provider>
    );

export default ReduxApp(App);
