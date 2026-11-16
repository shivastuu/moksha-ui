import { Text, View } from 'react-native';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { softTones } from '../utils/tones';
import type { TagProps } from './Tag.shared';

/** A small bordered status pill, like "Paid", "KYC pending" or "Blocked" */
export function Tag({ children, tone = 'neutral', dot, icon, size = 'md', testID }: TagProps) {
  const theme = useTheme();
  const { colors, space, radius, borderWidth, typography } = theme;
  const { background, border, ink } = softTones(colors)[tone];
  return (
    <View
      testID={testID}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: space.xs,
        height: size === 'sm' ? 22 : 28,
        paddingHorizontal: size === 'sm' ? space.sm : space.sm + 2,
        borderRadius: radius.full,
        borderWidth: borderWidth.thin,
        borderColor: border,
        backgroundColor: background,
      }}
    >
      {icon ?? (dot ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: ink }} /> : null)}
      <Text style={{ color: ink, fontSize: typography.fontSize[size === 'sm' ? 'xs' : 'sm'], ...fontFor(theme, 'medium') }}>{children}</Text>
    </View>
  );
}
