import { View } from 'react-native';

/** A check mark drawn as the corner of a rotated box */
export function CheckIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <View accessible={false} importantForAccessibility="no" style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.32,
          height: size * 0.6,
          marginTop: -size * 0.12,
          borderRightWidth: 2,
          borderBottomWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}
