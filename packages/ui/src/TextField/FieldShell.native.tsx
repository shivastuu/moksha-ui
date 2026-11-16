import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme/context';
import { textStyleFor } from '../theme/textStyle';

export interface FieldShellProps {
  label: string;
  hideLabel?: boolean;
  required?: boolean;
  message?: string;
  invalid?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

/** Label, input area and helper or error text */
export function FieldShell({ label, hideLabel, required, message, invalid, disabled, children }: FieldShellProps) {
  const theme = useTheme();
  const { colors, components, opacity } = theme;
  const { field } = components;

  return (
    <View style={{ opacity: disabled ? opacity.disabled : 1 }}>
      {!hideLabel && (
        <Text style={[textStyleFor(theme, field.labelStyle), { color: colors.text, marginBottom: field.labelGap }]}>
          {label}
          {required ? ' *' : ''}
        </Text>
      )}
      {children}
      {message ? (
        <Text
          style={[
            textStyleFor(theme, field.messageStyle),
            { color: invalid ? colors.danger : colors.textMuted, marginTop: field.messageGap },
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}
