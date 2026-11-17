import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronIcon } from '../Icon/ChevronIcon.native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { visibleCrumbs, type BreadcrumbsProps } from './Breadcrumbs.shared';

/** Where you are: links up the path, and the current page last. A long middle folds behind "…" */
export function Breadcrumbs({ items, maxItems = 4, testID }: BreadcrumbsProps) {
  const theme = useTheme();
  const { colors, space, radius } = theme;
  const [expanded, setExpanded] = useState(false);
  const text = textStyleFor(theme, 'bodySmall');
  return (
    <View testID={testID} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.xs }}>
      {visibleCrumbs(items, maxItems, expanded).map((item, position) => {
        const index = item ? items.indexOf(item) : -1;
        const last = index === items.length - 1;
        return (
          <View key={item ? index : 'more'} style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs, flexShrink: last ? 1 : 0 }}>
            {position > 0 ? <ChevronIcon color={colors.textMuted} /> : null}
            {!item ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Show the full path"
                onPress={() => setExpanded(true)}
                hitSlop={8}
                style={{ paddingHorizontal: space.xs, borderRadius: radius.sm, backgroundColor: controlColors(colors).segmentTrack }}
              >
                <Text style={[text, { color: colors.textMuted }]}>…</Text>
              </Pressable>
            ) : last ? (
              <Text accessibilityLabel={`${item.label}, current page`} numberOfLines={1} style={[text, fontFor(theme, 'medium'), { flexShrink: 1, color: colors.text }]}>
                {item.label}
              </Text>
            ) : (
              <Pressable accessibilityRole="link" accessibilityLabel={item.label} onPress={item.onPress} hitSlop={8}>
                <Text style={[text, { color: colors.textMuted }]}>{item.label}</Text>
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
}
