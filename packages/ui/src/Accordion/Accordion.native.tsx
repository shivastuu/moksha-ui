import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { alpha } from '@moksha-ui/tokens';
import { ChevronIcon } from '../Icon/ChevronIcon.native';
import { isTextValue } from '../ListItem/ListItem.shared';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { useControllableState } from '../utils/useControllableState';
import { toggle, type AccordionItem, type AccordionProps } from './Accordion.shared';

function Section({ item, expanded, separated, onToggle }: { item: AccordionItem; expanded: boolean; separated: boolean; onToggle: () => void }) {
  const theme = useTheme();
  const { colors, motion, space } = theme;
  const reduced = useReducedMotion();
  const [height, setHeight] = useState(0);
  const progress = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    if (reduced !== false) {
      progress.setValue(expanded ? 1 : 0);
      return;
    }
    // Height can't run on the native driver; the chevron shares the same value so they stay in step
    const spring = Animated.spring(progress, { toValue: expanded ? 1 : 0, ...motion.spring.smooth, useNativeDriver: false });
    spring.start();
    return () => spring.stop();
  }, [expanded, reduced, progress, motion]);

  return (
    <View>
      {separated ? <View style={{ height: StyleSheet.hairlineWidth, marginHorizontal: space.lg, backgroundColor: surfaceColors(colors).edge }} /> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, backgroundColor: alpha(colors.text, pressed ? 0.08 : 0) })}
      >
        <Text style={[textStyleFor(theme, 'body'), fontFor(theme, 'medium'), { flex: 1, color: colors.text }]}>{item.title}</Text>
        <Animated.View style={{ transform: [{ rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>
          <ChevronIcon direction="down" />
        </Animated.View>
      </Pressable>
      <Animated.View
        accessibilityElementsHidden={!expanded}
        importantForAccessibility={expanded ? 'auto' : 'no-hide-descendants'}
        style={{ height: progress.interpolate({ inputRange: [0, 1], outputRange: [0, height] }), opacity: progress, overflow: 'hidden' }}
      >
        {/* Measured off-flow, so the full height is known before the section first opens */}
        <View style={{ position: 'absolute', top: 0, right: 0, left: 0 }} onLayout={(event) => setHeight(event.nativeEvent.layout.height)}>
          <View style={{ paddingHorizontal: space.lg, paddingBottom: space.lg }}>
            {isTextValue(item.content) ? <Text style={[textStyleFor(theme, 'bodySmall'), { color: colors.textMuted }]}>{item.content}</Text> : item.content}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

/** Sections that open and close on a spring, on one raised card */
export function Accordion({ items, multiple = false, value, defaultValue = [], onValueChange, testID }: AccordionProps) {
  const { colors, radius, shadows } = useTheme();
  const [open, setOpen] = useControllableState(value, defaultValue, onValueChange);
  return (
    <View testID={testID} style={{ borderRadius: radius.xl, backgroundColor: colors.surfaceRaised, boxShadow: `${shadows.sm}, 0px 0px 0px 1px ${surfaceColors(colors).edge}` }}>
      <View style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
        {items.map((item, index) => (
          <Section key={item.value} item={item} expanded={open.includes(item.value)} separated={index > 0} onToggle={() => setOpen(toggle(open, item.value, multiple))} />
        ))}
      </View>
    </View>
  );
}
