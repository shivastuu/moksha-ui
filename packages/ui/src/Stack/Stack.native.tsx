import { View } from 'react-native';
import { useTheme } from '../theme/context';
import { flexAlign, flexJustify, type StackProps } from './Stack.shared';

/** Lays children out in a row or column with even spacing from the theme */
export function Stack({ children, direction = 'column', gap = 'md', align = 'stretch', justify = 'start', wrap, testID }: StackProps) {
  const { space } = useTheme();
  return (
    <View
      testID={testID}
      style={{
        flexDirection: direction,
        gap: space[gap],
        alignItems: flexAlign(align),
        justifyContent: flexJustify(justify),
        flexWrap: wrap ? 'wrap' : undefined,
      }}
    >
      {children}
    </View>
  );
}
