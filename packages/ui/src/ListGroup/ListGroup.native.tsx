import { Children, isValidElement } from 'react';
import { Text, View } from 'react-native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { textStyleFor } from '../theme/textStyle';
import { ListGroupContext, type ListGroupProps } from './ListGroup.shared';

/** Rows on one raised card with inset dividers, under an optional title */
export function ListGroup({ children, title, footer, testID }: ListGroupProps) {
  const theme = useTheme();
  const { colors, space, radius, shadows } = theme;
  const note = [textStyleFor(theme, 'bodySmall'), { color: colors.textMuted, paddingHorizontal: space.lg }];
  return (
    <View testID={testID} style={{ gap: space.sm }}>
      {title ? (
        <Text accessibilityRole="header" style={[note, textStyleFor(theme, 'label')]}>
          {title}
        </Text>
      ) : null}
      {/* Shadow outside, clipping inside: on iOS overflow hidden would cut the shadow off */}
      <View style={{ borderRadius: radius.xl, backgroundColor: colors.surfaceRaised, boxShadow: `${shadows.sm}, 0px 0px 0px 1px ${surfaceColors(colors).edge}` }}>
        <View accessibilityRole="list" style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
          {Children.toArray(children).map((child, index) => (
            <ListGroupContext.Provider key={isValidElement(child) ? child.key : index} value={index > 0}>
              {child}
            </ListGroupContext.Provider>
          ))}
        </View>
      </View>
      {footer ? <Text style={note}>{footer}</Text> : null}
    </View>
  );
}
