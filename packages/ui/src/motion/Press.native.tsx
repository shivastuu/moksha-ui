import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { alpha, mix } from '@moksha-ui/tokens';
import { useTheme } from '../theme/context';
import { usePressScale } from './nativeMotion.native';

export interface PressProps extends Omit<PressableProps, 'style'> {
  /** The element's own text color. The wash is this color, like currentColor on the web, so it shows on any fill */
  ink: string;
  /** The element's fill, if it has one; the wash is mixed over it */
  fill?: string;
  /** Buttons, chips, keys and days also give under the finger on the snappy spring; rows only wash */
  object?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Layout for the shrinking wrapper of an object, like flex: 1 */
  outerStyle?: StyleProp<ViewStyle>;
}

/** The native press feel, the same as the web's ds-press: a wash at the theme's pressed strength, and objects give */
export function Press({ ink, fill, object, style, outerStyle, onPressIn, onPressOut, disabled, ...props }: PressProps) {
  const { opacity } = useTheme();
  const press = usePressScale();
  const pressable = (
    <Pressable
      {...props}
      disabled={disabled}
      onPressIn={(event) => {
        if (object) {
          press.onPressIn();
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        if (object) {
          press.onPressOut();
        }
        onPressOut?.(event);
      }}
      style={({ pressed }) => [
        fill ? { backgroundColor: fill } : null,
        style,
        pressed && !disabled ? { backgroundColor: fill ? mix(ink, fill, opacity.pressed) : alpha(ink, opacity.pressed) } : null,
      ]}
    />
  );
  return object ? <Animated.View style={[outerStyle, { transform: [{ scale: press.scale }] }]}>{pressable}</Animated.View> : pressable;
}
