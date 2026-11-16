import { View } from 'react-native';
import { useTheme } from '../theme/context';

export function SearchIcon() {
  const { colors, borderWidth } = useTheme();
  const stroke = borderWidth.thick;
  return (
    <View accessible={false} importantForAccessibility="no" style={{ width: 16, height: 16 }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          borderRadius: 6,
          borderWidth: stroke,
          borderColor: colors.textMuted,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 9,
          left: 11,
          width: stroke,
          height: 6,
          borderRadius: stroke,
          backgroundColor: colors.textMuted,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}
