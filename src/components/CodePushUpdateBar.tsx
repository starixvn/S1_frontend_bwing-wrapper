import ProgressBar from '@components/ProgressBar';
import useLocalization from '@hooks/useLocalization';
import { Text, useTheme } from 'native-base';
import { IViewProps } from 'native-base/lib/typescript/components/basic/View/types';
import React from 'react';
import { View } from 'react-native';

interface CodePushUpdateBar extends IViewProps {
  progress: number;
}

function CodePushUpdateBar<CodePushUpdateBar>({ progress = 0, ...rest }) {
  const percentage = Math.floor(progress * 100);

  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <View {...rest}>
      <Text color="white" textAlign="center" fontSize={12} mb={1}>{`${t(
        'common.loading',
      )} (${percentage}%)`}</Text>
      <View style={{ flexDirection: 'row' }}>
        <ProgressBar
          progress={progress}
          bgColor={'#c2c2c2'}
          color={colors.secondary[500]}
        />
      </View>
    </View>
  );
}

export default CodePushUpdateBar;
