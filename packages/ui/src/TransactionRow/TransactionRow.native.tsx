import { Text, View } from 'react-native';
import { Avatar } from '../Avatar/Avatar.native';
import { ListItem } from '../ListItem/ListItem.native';
import { Tag } from '../Tag/Tag.native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { statusTags, transactionAmount, transactionColors, transactionLabel, type TransactionRowProps } from './TransactionRow.shared';

/** One payment in a feed: who, how and when, the signed amount, and a tag while pending or failed */
export function TransactionRow(props: TransactionRowProps) {
  const { name, direction, time, method, status = 'completed', leading, onPress, testID } = props;
  const theme = useTheme();
  const { colors, space } = theme;
  const tag = status === 'completed' ? undefined : statusTags[status];
  const failed = status === 'failed';
  const color = failed ? colors.textMuted : direction === 'credit' ? transactionColors(colors).credit : colors.text;
  return (
    <ListItem
      title={name}
      description={method ? `${method} · ${time}` : time}
      leading={leading ?? <Avatar name={name} />}
      trailing={
        <View style={{ alignItems: 'flex-end', gap: space.xs }}>
          <Text
            style={[
              textStyleFor(theme, 'body'),
              fontFor(theme, 'medium'),
              { color, fontVariant: ['tabular-nums'], textDecorationLine: failed ? 'line-through' : 'none' },
            ]}
          >
            {transactionAmount(props)}
          </Text>
          {tag ? (
            <Tag tone={tag.tone} size="sm">
              {tag.label}
            </Tag>
          ) : null}
        </View>
      }
      onPress={onPress}
      accessibilityLabel={transactionLabel(props)}
      testID={testID}
    />
  );
}
