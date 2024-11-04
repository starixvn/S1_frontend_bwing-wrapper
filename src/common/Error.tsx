import useLocalization from '@hooks/useLocalization';
import { Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import { WebViewProps } from 'react-native-webview';

type WebViewRenderErrorType = NonNullable<WebViewProps['renderError']>;
type WebViewError = Parameters<WebViewRenderErrorType>;

interface ErrorProps {
  errorDomain: WebViewError[0];
  errorCode: WebViewError[1];
  errorDesc: WebViewError[2];
}

const Error = (props: ErrorProps) => {
  const { errorCode, errorDesc } = props;

  const { t } = useLocalization();

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#010e33',
        height: '100%',
        width: '100%',
      }}>
      <Text style={{ textAlign: 'justify' }} bold color={'white'}>
        {t('systemError')}
      </Text>

      <View
        style={{
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Text bold color={'white'}>
          {errorCode}
        </Text>
        <Text style={{ textAlign: 'center' }} bold color={'white'}>
          {errorDesc}
        </Text>
      </View>
    </View>
  );
};

export default Error;
