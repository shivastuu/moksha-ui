import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { Badge } from '../Badge/Badge.native';
import { Press } from '../motion/Press.native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { Surface } from '../Surface/Surface.native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { textTones } from '../utils/tones';
import { useControllableState } from '../utils/useControllableState';
import { tabItem, type TabBarProps } from './TabBar.shared';

/** A floating glass bar of icons for an app's main sections. A raised pill springs to the one you're on */
export function TabBar({ items, value, defaultValue, onValueChange, accessibilityLabel = 'Main', testID }: TabBarProps) {
  const theme = useTheme();
  const { colors, motion, radius, shadows } = theme;
  const [selected, setSelected] = useControllableState(value, defaultValue ?? items[0]?.value ?? '', onValueChange);
  const index = items.findIndex((item) => item.value === selected);
  const caption = textStyleFor(theme, 'caption');
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
            <Press
              key={item.value}
              object
              ink={colors.text}
              outerStyle={{ flex: 1 }}
              accessibilityRole="tab"
              accessibilityLabel={item.badge ? `${item.label}, ${item.badge} new` : item.label}
              accessibilityState={{ selected: active }}
              onPress={() => setSelected(item.value)}
              style={{ flexGrow: 1, minHeight: tabItem.height, paddingVertical: (tabItem.height - tabItem.icon - tabItem.gap - caption.lineHeight) / 2, alignItems: 'center', gap: tabItem.gap, borderRadius: radius.full }}
            >
              <View style={{ height: tabItem.icon, justifyContent: 'center' }}>
                {item.icon(color)}
                {item.badge ? (
                  <View style={{ position: 'absolute', top: -7, left: 17 }}>
                    <Badge count={item.badge} />
                  </View>
                ) : null}
              </View>
              <Text style={[caption, fontFor(theme, 'medium'), { color, textAlign: 'center' }]}>
                {item.label}
              </Text>
            </Press>
          );
        })}
      </View>
    </Surface>
  );
}
