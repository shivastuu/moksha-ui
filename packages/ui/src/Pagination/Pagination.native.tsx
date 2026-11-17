import { Animated, Text, View } from 'react-native';
import { buttonDepth } from '../Button/Button.shared';
import { ChevronIcon } from '../Icon/ChevronIcon.native';
import { usePop } from '../motion/nativeMotion.native';
import { Press } from '../motion/Press.native';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { useControllableState } from '../utils/useControllableState';
import { pageItems, type PaginationProps } from './Pagination.shared';

function PageButton({ page, current, onPress }: { page: number; current: boolean; onPress: () => void }) {
  const theme = useTheme();
  const { colors, radius, typography } = theme;
  const depth = buttonDepth(colors);
  const scale = usePop(current);
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Press
        object
        ink={current ? colors.textOnPrimary : colors.text}
        fill={current ? colors.primary : undefined}
        accessibilityRole="button"
        accessibilityLabel={`Page ${page}`}
        accessibilityState={{ selected: current }}
        onPress={onPress}
        style={{
          minWidth: 36,
          height: 36,
          paddingHorizontal: 8,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius.full,
          // The same top-lit fill and glow as a primary Button
          backgroundImage: current ? depth.primaryFill : undefined,
          boxShadow: current ? depth.primaryShadow : undefined,
        }}
      >
        <Text style={{ color: current ? colors.textOnPrimary : colors.text, fontSize: typography.fontSize.sm, fontVariant: ['tabular-nums'], ...fontFor(theme, 'medium') }}>{page}</Text>
      </Press>
    </Animated.View>
  );
}

/** Previous, numbered pages with ellipses, next. The current page is a filled pill that pops in */
export function Pagination({ page, defaultPage = 1, onPageChange, pageCount, accessibilityLabel = 'Pagination', testID }: PaginationProps) {
  const theme = useTheme();
  const { colors, space, opacity } = theme;
  const [current, setCurrent] = useControllableState(page, defaultPage, onPageChange);
  if (pageCount < 1) {
    return null;
  }
  const go = (next: number) => next !== current && setCurrent(next);
  const arrow = (direction: 'left' | 'right', disabled: boolean, target: number) => (
    <Press
      object
      ink={colors.text}
      accessibilityRole="button"
      accessibilityLabel={direction === 'left' ? 'Previous page' : 'Next page'}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => go(target)}
      style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18, opacity: disabled ? opacity.disabled : 1 }}
    >
      <ChevronIcon direction={direction} color={colors.text} />
    </Press>
  );
  return (
    <View testID={testID} accessibilityLabel={accessibilityLabel} style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
      {arrow('left', current <= 1, current - 1)}
      {pageItems(current, pageCount).map((item) =>
        typeof item === 'number' ? (
          <PageButton key={item} page={item} current={item === current} onPress={() => go(item)} />
        ) : (
          <Text key={item} importantForAccessibility="no" accessibilityElementsHidden style={{ minWidth: 24, textAlign: 'center', color: colors.textMuted }}>
            …
          </Text>
        )
      )}
      {arrow('right', current >= pageCount, current + 1)}
    </View>
  );
}
