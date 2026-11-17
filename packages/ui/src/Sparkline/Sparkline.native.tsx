import { View } from 'react-native';
import { useTheme } from '../theme/context';
import { sampleCurve, sparkColor, sparkPoints, type SparklineProps } from './Sparkline.shared';

const stroke = 2;

/** A small trend line with a dot on the latest value, drawn from short segments of the same curve as the web */
export function Sparkline({ data, accessibilityLabel, width = 120, height = 36, tone = 'auto', upIsGood = true, testID }: SparklineProps) {
  const { colors } = useTheme();
  if (!data.length) {
    return null;
  }
  const points = sparkPoints(data, width, height);
  const curve = sampleCurve(points);
  const color = sparkColor(colors, data, tone, upIsGood);
  const [lastX, lastY] = points[points.length - 1]!;
  return (
    <View testID={testID} accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={{ width, height }}>
      {curve.slice(1).map(([x1, y1], index) => {
        const [x0, y0] = curve[index]!;
        // A rounded bar from one sample to the next, a little longer than the gap so the joints don't show
        const length = Math.hypot(x1 - x0, y1 - y0) + stroke * 0.6;
        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              left: (x0 + x1) / 2 - length / 2,
              top: (y0 + y1) / 2 - stroke / 2,
              width: length,
              height: stroke,
              borderRadius: stroke / 2,
              backgroundColor: color,
              transform: [{ rotate: `${Math.atan2(y1 - y0, x1 - x0)}rad` }],
            }}
          />
        );
      })}
      <View style={{ position: 'absolute', left: lastX - 4.5, top: lastY - 4.5, width: 9, height: 9, borderRadius: 4.5, borderWidth: 1.5, borderColor: colors.background, backgroundColor: color }} />
    </View>
  );
}
