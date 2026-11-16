import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { useControllableState } from '../utils/useControllableState';
import type { TabsProps } from './Tabs.shared';

/** Tabs with an underline that slides and resizes to the selected tab, on the theme's smooth spring */
export function Tabs({ items, value, defaultValue, onValueChange, accessibilityLabel, testID }: TabsProps) {
  const theme = useTheme();
  const { colors, components, motion, space, radius, typography } = theme;
  const [selected, setSelected] = useControllableState(value, defaultValue ?? items[0]?.value ?? '', onValueChange);
  const index = items.findIndex((item) => item.value === selected);
  const reduced = useReducedMotion();
  const [layouts, setLayouts] = useState<{ x: number; width: number }[]>([]);
  const left = useRef(new Animated.Value(0)).current;
  const width = useRef(new Animated.Value(0)).current;
  const placed = useRef(false);
  const target = layouts[index];

  useEffect(() => {
    if (!target) {
      return;
    }
    // The first placement jumps; only later changes move
    if (reduced !== false || !placed.current) {
      placed.current = true;
      left.setValue(target.x);
      width.setValue(target.width);
      return;
    }
    // Width can't run on the native driver, and scaleX would stretch the rounded ends
    const slide = Animated.parallel([
      Animated.spring(left, { toValue: target.x, ...motion.spring.smooth, useNativeDriver: false }),
      Animated.spring(width, { toValue: target.width, ...motion.spring.smooth, useNativeDriver: false }),
    ]);
    slide.start();
    return () => slide.stop();
  }, [target?.x, target?.width, reduced, left, width, motion]);

  return (
    <View testID={testID} style={{ gap: space.lg }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="tablist"
        accessibilityLabel={accessibilityLabel}
        style={{ flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border }}
        contentContainerStyle={{ gap: space.xl }}
      >
        {items.map((item, position) => (
          <Pressable
            key={item.value}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: position === index }}
            onPress={() => setSelected(item.value)}
            onLayout={({ nativeEvent: { layout } }) =>
              setLayouts((previous) => {
                const next = [...previous];
                next[position] = { x: layout.x, width: layout.width };
                return next;
              })
            }
            style={{ height: components.tabs.height, justifyContent: 'center' }}
          >
            <Text style={{ color: position === index ? colors.text : colors.textMuted, fontSize: typography.fontSize.md, ...fontFor(theme, 'medium') }}>{item.label}</Text>
          </Pressable>
        ))}
        {target ? (
          <Animated.View
            pointerEvents="none"
            style={{ position: 'absolute', bottom: 0, left, width, height: components.tabs.indicator, borderRadius: radius.full, backgroundColor: controlColors(colors).indicator }}
          />
        ) : null}
      </ScrollView>
      {index >= 0 ? <View>{items[index]!.content}</View> : null}
    </View>
  );
}
