import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { Press } from '../motion/Press.native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { textTones } from '../utils/tones';
import { useControllableState } from '../utils/useControllableState';
import { itemLabel, sidebarRow, type SidebarProps } from './Sidebar.shared';

/** App navigation for tablets: grouped rows, and a raised pill that springs to the page you're on */
export function Sidebar({ sections, value, defaultValue, onValueChange, header, footer, accessibilityLabel = 'Main', testID }: SidebarProps) {
  const theme = useTheme();
  const { colors, motion, space, radius, shadows } = theme;
  const first = sections[0]?.items[0]?.value ?? '';
  const [selected, setSelected] = useControllableState(value, defaultValue ?? first, onValueChange);
  const reduced = useReducedMotion();
  // Rows sit in one flat column, so each onLayout y is measured from the same top
  const [tops, setTops] = useState<Record<string, number>>({});
  const top = useRef(new Animated.Value(0)).current;
  const placed = useRef(false);
  const target = tops[selected];

  useEffect(() => {
    if (target === undefined) {
      return;
    }
    if (reduced !== false || !placed.current) {
      placed.current = true;
      top.setValue(target);
      return;
    }
    const spring = Animated.spring(top, { toValue: target, ...motion.spring.smooth, useNativeDriver: true });
    spring.start();
    return () => spring.stop();
  }, [target, reduced, top, motion]);

  return (
    <View testID={testID} accessibilityLabel={accessibilityLabel} style={{ width: 260, flex: 1, gap: space.lg, paddingVertical: space.lg, paddingHorizontal: space.md, backgroundColor: colors.surface, borderRightWidth: 1, borderRightColor: surfaceColors(colors).edge }}>
      {header}
      <View style={{ flex: 1 }}>
        {target !== undefined ? (
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: sidebarRow,
              borderRadius: radius.md,
              backgroundColor: colors.surfaceRaised,
              boxShadow: `${shadows.sm}, 0px 0px 0px 1px ${surfaceColors(colors).edge}`,
              transform: [{ translateY: top }],
            }}
          />
        ) : null}
        {sections.map((section, index) => [
          section.title ? (
            <Text
              key={`title-${index}`}
              accessibilityRole="header"
              style={[textStyleFor(theme, 'caption'), fontFor(theme, 'semibold'), { marginTop: index ? space.lg : 0, marginBottom: space.xs, paddingHorizontal: space.md, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }]}
            >
              {section.title}
            </Text>
          ) : null,
          ...section.items.map((item) => {
            const active = item.value === selected;
            const color = active ? textTones(colors).primary : colors.textMuted;
            return (
              <Press
                key={item.value}
                ink={colors.text}
                accessibilityRole="button"
                accessibilityLabel={itemLabel(item)}
                accessibilityState={{ selected: active }}
                onPress={() => setSelected(item.value)}
                onLayout={(event) => {
                  const y = event.nativeEvent.layout.y;
                  setTops((previous) => (previous[item.value] === y ? previous : { ...previous, [item.value]: y }));
                }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, height: sidebarRow, marginBottom: 2, paddingHorizontal: space.md, borderRadius: radius.md }}
              >
                {item.icon ? <View style={{ width: 20, alignItems: 'center' }}>{item.icon(color)}</View> : null}
                <Text numberOfLines={1} style={[textStyleFor(theme, 'bodySmall'), fontFor(theme, 'medium'), { flex: 1, color: active ? colors.text : colors.textMuted }]}>
                  {item.label}
                </Text>
                {item.count ? (
                  <Text style={[textStyleFor(theme, 'caption'), { minWidth: 20, paddingHorizontal: 6, borderRadius: radius.full, overflow: 'hidden', backgroundColor: controlColors(colors).segmentTrack, color: colors.text, textAlign: 'center', fontVariant: ['tabular-nums'] }]}>
                    {item.count}
                  </Text>
                ) : null}
              </Press>
            );
          }),
        ])}
      </View>
      {footer}
    </View>
  );
}
