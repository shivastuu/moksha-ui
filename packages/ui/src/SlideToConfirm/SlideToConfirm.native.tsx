import { useRef, useState } from 'react';
import { Animated, PanResponder, View } from 'react-native';
import { buttonDepth } from '../Button/Button.shared';
import { CheckIcon } from '../Icon/CheckIcon.native';
import { ChevronIcon } from '../Icon/ChevronIcon.native';
import { Spinner } from '../Spinner/Spinner.native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { clampOffset, slide, type SlideState, type SlideToConfirmProps } from './SlideToConfirm.shared';

/** Slide the knob to the end to confirm. It fires only when released past 90%; screen readers confirm with a double tap */
export function SlideToConfirm({ label, onConfirm, pendingLabel = 'Processing', doneLabel = 'Done', disabled, testID }: SlideToConfirmProps) {
  const theme = useTheme();
  const { colors, motion, radius, shadows, opacity } = theme;
  const depth = buttonDepth(colors);
  const [state, setState] = useState<SlideState>('idle');
  const [width, setWidth] = useState(0);
  const offset = useRef(new Animated.Value(0)).current;
  const travel = Math.max(1, width - slide.knob - slide.inset * 2);
  const ready = state === 'idle' && !disabled;

  const springTo = (toValue: number) => Animated.spring(offset, { toValue, ...motion.spring.snappy, useNativeDriver: true }).start();

  const confirm = async () => {
    if (!ready) {
      return;
    }
    springTo(travel);
    setState('pending');
    try {
      await onConfirm();
      setState('done');
    } catch {
      // Fail closed: back to the start, never "Done"
      springTo(0);
      setState('idle');
    }
  };

  // The responder is created once, so it reads this render's values through a ref
  const latest = useRef({ ready, travel, confirm, springTo, position: 0 });
  Object.assign(latest.current, { ready, travel, confirm, springTo });
  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => latest.current.ready,
      onMoveShouldSetPanResponder: () => latest.current.ready,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gesture) => {
        latest.current.position = clampOffset(gesture.dx, latest.current.travel);
        offset.setValue(latest.current.position);
      },
      onPanResponderRelease: () => {
        if (latest.current.position >= latest.current.travel * slide.threshold) {
          void latest.current.confirm();
        } else {
          latest.current.springTo(0);
        }
        latest.current.position = 0;
      },
      onPanResponderTerminate: () => latest.current.springTo(0),
    })
  ).current;

  const text = state === 'done' ? doneLabel : state === 'pending' ? pendingLabel : label;
  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled: !ready, busy: state === 'pending' }}
      onAccessibilityTap={confirm}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={{
        height: slide.height,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: slide.knob + slide.inset * 2,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        backgroundImage: depth.primaryFill,
        boxShadow: depth.primaryShadow,
        opacity: disabled && state === 'idle' ? opacity.disabled : 1,
      }}
    >
      <Animated.Text
        numberOfLines={1}
        style={[
          textStyleFor(theme, 'body'),
          fontFor(theme, 'semibold'),
          { color: colors.textOnPrimary, opacity: state === 'idle' ? offset.interpolate({ inputRange: [0, travel * 0.6], outputRange: [1, 0], extrapolate: 'clamp' }) : 1 },
        ]}
      >
        {text}
      </Animated.Text>
      <Animated.View
        {...responder.panHandlers}
        style={{
          position: 'absolute',
          top: slide.inset,
          left: slide.inset,
          width: slide.knob,
          height: slide.knob,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: slide.knob / 2,
          backgroundColor: controlColors(colors).thumb,
          boxShadow: shadows.md,
          transform: [{ translateX: offset }],
        }}
      >
        {state === 'done' ? (
          <CheckIcon color={colors.primary} size={20} />
        ) : state === 'pending' ? (
          <Spinner size="sm" />
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <ChevronIcon color={colors.primary} />
            <View style={{ marginLeft: -9, opacity: 0.45 }}>
              <ChevronIcon color={colors.primary} />
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}
