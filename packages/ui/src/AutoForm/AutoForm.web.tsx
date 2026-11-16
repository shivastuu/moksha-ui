'use client';

import type { ReactNode } from 'react';
import { Button } from '../Button/Button.web';
import { AccountNumberField, AmountField, PhoneField } from '../inputs/fields.web';
import { OtpField } from '../OtpField/OtpField.web';
import { TextField } from '../TextField/TextField.web';
import { createAutoForm } from './AutoForm.shared';

function Form({ children, testID }: { children: ReactNode; testID?: string }) {
  return (
    <form
      noValidate
      // Enter is handled per field (next field, or submit on the last one)
      onSubmit={(event) => event.preventDefault()}
      data-testid={testID}
      style={{ display: 'grid', gap: 'var(--ds-space-lg)' }}
    >
      {children}
    </form>
  );
}

/** Builds a whole form from a list of fields: layout, validation, errors, focus and submit */
export const AutoForm = createAutoForm({ Form, Button, TextField, PhoneField, AmountField, AccountNumberField, OtpField });
