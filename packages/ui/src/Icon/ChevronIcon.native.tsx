import { View } from 'react-native';
import { useTheme } from '../theme/context';

/** A thin chevron drawn as the corner of a rotated box, pointing right or down */
export function ChevronIcon({ direction = 'right', color }: { direction?: 'right' | 'down'; color?: string }) {
  const { colors } = useTheme();
  // 1.5 matches the web icon's 2px stroke drawn at 16px
  const stroke = 1.5;
  const right = direction === 'right';
  return (
    <View accessible={false} importantForAccessibility="no" style={{ width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 7,
          height: 7,
          // Pull the corner back to the middle: rotating moves its visual center
          marginLeft: right ? -3 : 0,
          marginTop: right ? 0 : -3,
          borderRightWidth: stroke,
          borderBottomWidth: right ? 0 : stroke,
          borderTopWidth: right ? stroke : 0,
          borderColor: color ?? colors.textMuted,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}
