import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Badge } from '../Badge/Badge.native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { Surface } from '../Surface/Surface.native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { textTones } from '../utils/tones';
import { useControllableState } from '../utils/useControllableState';
import type { TabBarProps } from './TabBar.shared';

/** A floating glass bar of icons for an app's main sections. A raised pill springs to the one you're on */
export function TabBar({ items, value, defaultValue, onValueChange, accessibilityLabel = 'Main', testID }: TabBarProps) {
  const theme = useTheme();
  const { colors, motion, radius, shadows } = theme;
  const [selected, setSelected] = useControllableState(value, defaultValue ?? items[0]?.value ?? '', onValueChange);
  const index = items.findIndex((item) => item.value === selected);
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const segment = items.length ? width / items.length : 0;
  const position = useRef(new Animated.Value(Math.max(index, 0))).current;

  useEffect(() => {
    if (reduced !== false) {
      position.setValue(Math.max(index, 0));
      return;
    }
    const spring = Animated.spring(position, { toValue: Math.max(index, 0), ...motion.spring.smooth, useNativeDriver: true });
    spring.start();
    return () => spring.stop();
  }, [index, reduced, position, motion]);

  return (
    <Surface variant="glass" radius="full" padding="xs" testID={testID}>
      <View accessibilityRole="tablist" accessibilityLabel={accessibilityLabel} onLayout={(event) => setWidth(event.nativeEvent.layout.width)} style={{ flexDirection: 'row' }}>
        {index >= 0 && segment > 0 ? (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: segment,
              borderRadius: radius.full,
              backgroundColor: colors.surfaceRaised,
              boxShadow: `${shadows.sm}, 0px 0px 0px 1px ${surfaceColors(colors).edge}`,
              transform: [{ translateX: Animated.multiply(position, segment) }],
            }}
          />
        ) : null}
        {items.map((item, at) => {
          const active = at === index;
          const color = active ? textTones(colors).primary : colors.textMuted;
          return (
            <Pressable
              key={item.value}
              accessibilityRole="tab"
              accessibilityLabel={item.badge ? `${item.label}, ${item.badge} new` : item.label}
              accessibilityState={{ selected: active }}
              onPress={() => setSelected(item.value)}
              style={{ flex: 1, height: 52, alignItems: 'center', justifyContent: 'center', gap: 2 }}
            >
              <View>
                {item.icon(color)}
                {item.badge ? (
                  <View style={{ position: 'absolute', top: -7, left: 17 }}>
                    <Badge count={item.badge} />
                  </View>
                ) : null}
              </View>
              <Text numberOfLines={1} style={[textStyleFor(theme, 'caption'), fontFor(theme, 'medium'), { color }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Surface>
  );
}
