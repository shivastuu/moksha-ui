import { View } from 'react-native';

/** Two overlapping sheets: copy */
export function CopyIcon({ color, background, size = 16 }: { color: string; background: string; size?: number }) {
  const sheet = size * 0.62;
  const box = { position: 'absolute', width: sheet, height: sheet, borderWidth: 1.5, borderColor: color, borderRadius: size * 0.16 } as const;
  return (
    <View accessible={false} importantForAccessibility="no" style={{ width: size, height: size }}>
      <View style={{ ...box, top: 0, left: 0 }} />
      {/* The front sheet is filled so it hides the back sheet's corner */}
      <View style={{ ...box, right: 0, bottom: 0, backgroundColor: background }} />
    </View>
  );
}
