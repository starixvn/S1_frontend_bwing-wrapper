import React from 'react';
import { ActivityIndicator, Image, View } from 'react-native';

const Loading = () => {
  const LOGO_IMAGE = 'https://banner.bw88.io/h5/img/logo.png';
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
        zIndex: 10,
        elevation: 10
      }}>
      <Image
        source={{ uri: LOGO_IMAGE }}
        style={{ width: '80%', height: '80%' }}
        resizeMode={'contain'}
      />
    </View>
  );
};

export default Loading;
