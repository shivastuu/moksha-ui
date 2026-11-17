import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { tooltipTiming, type TooltipProps } from './Tooltip.shared';

/**
 * A dark hint shown on a long press. Raw touch events reach this wrapper even while the child handles the
 * press, so the child's onPress still works
 */
export function Tooltip({ label, children, side = 'top', testID }: TooltipProps) {
  const theme = useTheme();
  const { colors, space, radius, shadows } = theme;
  const [shown, setShown] = useState(false);
  const timers = useRef<{ press?: ReturnType<typeof setTimeout>; stay?: ReturnType<typeof setTimeout> }>({});
  const clear = () => {
    clearTimeout(timers.current.press);
    clearTimeout(timers.current.stay);
  };
  useEffect(() => clear, []);

  const start = () => {
    clear();
    timers.current.press = setTimeout(() => {
      setShown(true);
      timers.current.stay = setTimeout(() => setShown(false), tooltipTiming.touchStay);
    }, tooltipTiming.longPress);
  };

  return (
    <View onTouchStart={start} onTouchEnd={() => clearTimeout(timers.current.press)} onTouchCancel={() => clearTimeout(timers.current.press)} style={{ alignSelf: 'flex-start' }}>
      {children}
      {shown ? (
        // ponytail: drawn inside the wrapper, so an ancestor with overflow hidden can clip it; move to a Modal if that bites
        <View
          testID={testID}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ position: 'absolute', left: -120, right: -120, alignItems: 'center', zIndex: 10, [side === 'top' ? 'bottom' : 'top']: '100%', [side === 'top' ? 'marginBottom' : 'marginTop']: 6 }}
        >
          <View style={{ paddingHorizontal: space.sm, paddingVertical: space.xs, borderRadius: radius.sm, backgroundColor: colors.surfaceInverse, boxShadow: shadows.md }}>
            <Text numberOfLines={1} style={[textStyleFor(theme, 'caption'), fontFor(theme, 'medium'), { color: colors.textInverse }]}>
              {label}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
