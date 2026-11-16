import { View } from 'react-native';
import { useTheme } from '../theme/context';
import { resolveShadow, type SurfaceProps } from './Surface.shared';

export function Surface({
  children,
  variant = 'solid',
  padding = 'lg',
  radius = 'lg',
  blur = 'md',
  shadow,
  testID,
}: SurfaceProps) {
  const { colors, space, radius: radii, borderWidth, shadows, glass, blurView: BlurView, scheme } = useTheme();
  const resolvedShadow = resolveShadow(variant, shadow);
  const base = {
    padding: space[padding],
    borderRadius: radii[radius],
    boxShadow: resolvedShadow === 'none' ? undefined : shadows[resolvedShadow],
  };

  if (variant === 'glass') {
    const glassStyle = {
      ...base,
      borderWidth: borderWidth.thin,
      borderColor: colors.glassBorder,
      overflow: 'hidden' as const,
    };
    return BlurView ? (
      <BlurView
        testID={testID}
        intensity={Math.min(100, glass.blur[blur] * 2)}
        tint={scheme}
        style={[glassStyle, { backgroundColor: colors.glassSurface }]}
      >
        {children}
      </BlurView>
    ) : (
      <View testID={testID} style={[glassStyle, { backgroundColor: colors.surfaceRaised }]}>
        {children}
      </View>
    );
  }

  return (
    <View
      testID={testID}
      style={[
        base,
        variant === 'solid'
          ? { backgroundColor: colors.surface, borderWidth: borderWidth.thin, borderColor: colors.border }
          : { backgroundColor: colors.surfaceRaised },
      ]}
    >
      {children}
    </View>
  );
}
