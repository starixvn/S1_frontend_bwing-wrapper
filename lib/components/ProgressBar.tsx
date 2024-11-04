import { useTheme } from 'native-base';
import * as React from 'react';
import {
  Animated,
  I18nManager,
  LayoutChangeEvent,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

type Props = React.ComponentPropsWithRef<typeof View> & {
  progress?: number;
  color?: string;
  bgColor?: string;
  indeterminate?: boolean;
  visible?: boolean;
  style?: StyleProp<ViewStyle>;
};

const INDETERMINATE_DURATION = 2000;
const INDETERMINATE_MAX_WIDTH = 0.6;
const { isRTL } = I18nManager;

const ProgressBar = ({
  bgColor,
  color,
  indeterminate,
  style,
  progress = 0,
  visible = true,
  ...rest
}: Props) => {
  const { current: timer } = React.useRef<Animated.Value>(
    new Animated.Value(0),
  );
  const { colors } = useTheme();
  const { current: fade } = React.useRef<Animated.Value>(new Animated.Value(0));
  const [width, setWidth] = React.useState<number>(0);
  const [prevWidth, setPrevWidth] = React.useState<number>(0);

  const indeterminateAnimation =
    React.useRef<Animated.CompositeAnimation | null>(null);

  const scale = 1.0;

  const startAnimation = React.useCallback(() => {
    // Show progress bar
    Animated.timing(fade, {
      duration: 200 * scale,
      toValue: 1,
      useNativeDriver: true,
      isInteraction: false,
    }).start();

    // Animate progress bar
    if (indeterminate) {
      if (!indeterminateAnimation.current) {
        indeterminateAnimation.current = Animated.timing(timer, {
          duration: INDETERMINATE_DURATION,
          toValue: 1,
          // Animated.loop does not work if useNativeDriver is true on web
          useNativeDriver: Platform.OS !== 'web',
          isInteraction: false,
        });
      }

      // Reset timer to the beginning
      timer.setValue(0);

      Animated.loop(indeterminateAnimation.current).start();
    } else {
      Animated.timing(timer, {
        duration: 200 * scale,
        toValue: progress ? progress : 0,
        useNativeDriver: true,
        isInteraction: false,
      }).start();
    }
  }, [scale, timer, progress, indeterminate, fade]);

  const stopAnimation = React.useCallback(() => {
    // Stop indeterminate animation
    if (indeterminateAnimation.current) {
      indeterminateAnimation.current.stop();
    }

    Animated.timing(fade, {
      duration: 200 * scale,
      toValue: 0,
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  }, [fade, scale]);

  React.useEffect(() => {
    if (visible) startAnimation();
    else stopAnimation();
  }, [visible, startAnimation, stopAnimation]);

  React.useEffect(() => {
    // Start animation the very first time when previously the width was unclear
    if (visible && prevWidth === 0) {
      startAnimation();
    }
  }, [prevWidth, startAnimation, visible]);

  const onLayout = (event: LayoutChangeEvent) => {
    setPrevWidth(width);
    setWidth(event.nativeEvent.layout.width);
  };

  const tintColor = color || colors.primary;
  // const trackTintColor = setColor(tintColor).alpha(0.38).rgb().string();
  const trackTintColor = bgColor;

  return (
    <View
      onLayout={onLayout}
      {...rest}
      accessible
      accessibilityRole="progressbar"
      style={styles.wrapper}>
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: trackTintColor, opacity: fade },
          style,
        ]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: tintColor,
              width,
              transform: [
                {
                  translateX: timer.interpolate(
                    indeterminate
                      ? {
                          inputRange: [0, 0.5, 1],
                          outputRange: [
                            (isRTL ? 1 : -1) * 0.5 * width,
                            (isRTL ? 1 : -1) *
                              0.5 *
                              INDETERMINATE_MAX_WIDTH *
                              width,
                            (isRTL ? -1 : 1) * 0.7 * width,
                          ],
                        }
                      : {
                          inputRange: [0, 1],
                          outputRange: [(isRTL ? 1 : -1) * 0.5 * width, 0],
                        },
                  ),
                },
                {
                  // Workaround for workaround for https://github.com/facebook/react-native/issues/6278
                  scaleX: timer.interpolate(
                    indeterminate
                      ? {
                          inputRange: [0, 0.5, 1],
                          outputRange: [
                            0.0001,
                            INDETERMINATE_MAX_WIDTH,
                            0.0001,
                          ],
                        }
                      : {
                          inputRange: [0, 1],
                          outputRange: [0.0001, 1],
                        },
                  ),
                },
              ],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  container: {
    height: 4,
    overflow: 'hidden',
    borderRadius: 5,
  },

  progressBar: {
    flex: 1,
  },
});

export default ProgressBar;
