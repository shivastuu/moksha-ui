'use client';

import { Avatar } from '../Avatar/Avatar.web';
import { ListItem } from '../ListItem/ListItem.web';
import { Tag } from '../Tag/Tag.web';
import { statusTags, transactionAmount, transactionLabel, type TransactionRowProps } from './TransactionRow.shared';

/** One payment in a feed: who, how and when, the signed amount, and a tag while pending or failed */
export function TransactionRow(props: TransactionRowProps) {
  const { name, direction, time, method, status = 'completed', leading, onPress, testID } = props;
  const tag = status === 'completed' ? undefined : statusTags[status];
  return (
    <ListItem
      title={name}
      description={method ? `${method} · ${time}` : time}
      leading={leading ?? <Avatar name={name} />}
      trailing={
        <span className="ds-transaction" data-direction={direction} data-status={status}>
          <span className="ds-transaction__amount">{transactionAmount(props)}</span>
          {tag && (
            <Tag tone={tag.tone} size="sm">
              {tag.label}
            </Tag>
          )}
        </span>
      }
      onPress={onPress}
      accessibilityLabel={transactionLabel(props)}
      testID={testID}
    />
  );
}
