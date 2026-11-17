import { Animated, Text, View } from 'react-native';
import { CheckIcon } from '../Icon/CheckIcon.native';
import { useBreathe } from '../motion/nativeMotion.native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { solidTones } from '../utils/tones';
import { timelineDot, timelineLabel, type TimelineItem, type TimelineProps } from './Timeline.shared';

/** A soft halo that breathes behind the current step, on the same rhythm as every loader */
function Halo({ color }: { color: string }) {
  const breath = useBreathe();
  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: timelineDot,
        height: timelineDot,
        borderRadius: timelineDot / 2,
        backgroundColor: color,
        opacity: breath.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.1] }),
        transform: [{ scale: breath.interpolate({ inputRange: [0, 1], outputRange: [1.5, 2] }) }],
      }}
    />
  );
}

function Cross({ color }: { color: string }) {
  const bar = { position: 'absolute', width: 10, height: 2, borderRadius: 1, backgroundColor: color } as const;
  return (
    <View style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ ...bar, transform: [{ rotate: '45deg' }] }} />
      <View style={{ ...bar, transform: [{ rotate: '-45deg' }] }} />
    </View>
  );
}

function Step({ item, last }: { item: TimelineItem; last: boolean }) {
  const theme = useTheme();
  const { colors, space } = theme;
  const solid = solidTones(colors);
  const indicator = controlColors(colors).indicator;
  const fill = { complete: solid.success.background, failed: solid.danger.background, current: indicator, upcoming: colors.background }[item.status];
  const small = [textStyleFor(theme, 'bodySmall'), { color: colors.textMuted }];
  return (
    <View accessible accessibilityLabel={timelineLabel(item)} style={{ flexDirection: 'row', gap: space.md }}>
      <View style={{ width: timelineDot, alignItems: 'center', paddingTop: 2 }}>
        {item.status === 'current' ? <Halo color={indicator} /> : null}
        <View
          style={{
            width: timelineDot,
            height: timelineDot,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: timelineDot / 2,
            borderWidth: item.status === 'upcoming' ? 2 : 0,
            borderColor: controlColors(colors).boxBorder,
            backgroundColor: fill,
          }}
        >
          {item.status === 'complete' ? <CheckIcon color={solid.success.ink} size={12} /> : null}
          {item.status === 'failed' ? <Cross color={solid.danger.ink} /> : null}
        </View>
        {last ? null : (
          <View
            style={{
              flex: 1,
              width: 0,
              marginTop: 6,
              marginBottom: 4,
              borderLeftWidth: 2,
              borderStyle: item.status === 'complete' ? 'solid' : 'dashed',
              borderColor: item.status === 'complete' ? solid.success.background : colors.border,
            }}
          />
        )}
      </View>
      <View style={{ flex: 1, gap: 2, paddingBottom: last ? 0 : space.xl }}>
        <Text style={[textStyleFor(theme, 'body'), fontFor(theme, item.status === 'upcoming' ? 'regular' : 'medium'), { color: item.status === 'upcoming' ? colors.textMuted : colors.text }]}>
          {item.title}
        </Text>
        {item.description ? <Text style={small}>{item.description}</Text> : null}
      </View>
      {item.time ? <Text style={[small, { paddingTop: 2, fontVariant: ['tabular-nums'] }]}>{item.time}</Text> : null}
    </View>
  );
}

/** A payment's journey, step by step: done, in progress (pulsing), next or failed */
export function Timeline({ items, testID }: TimelineProps) {
  return (
    <View testID={testID}>
      {items.map((item, index) => (
        <Step key={index} item={item} last={index === items.length - 1} />
      ))}
    </View>
  );
}
