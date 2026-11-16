import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Button } from '../Button/Button.native';
import { AccountNumberField, AmountField, PhoneField } from '../inputs/fields.native';
import { OtpField } from '../OtpField/OtpField.native';
import { TextField } from '../TextField/TextField.native';
import { useTheme } from '../theme/context';
import { createAutoForm } from './AutoForm.shared';

function Form({ children, testID }: { children: ReactNode; testID?: string }) {
  const { space } = useTheme();
  return (
    <View testID={testID} style={{ gap: space.lg }}>
      {children}
    </View>
  );
}

/** Builds a whole form from a list of fields: layout, validation, errors, focus and submit */
export const AutoForm = createAutoForm({ Form, Button, TextField, PhoneField, AmountField, AccountNumberField, OtpField });
