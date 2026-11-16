'use client';

import { useRef, useState, type ComponentType, type ReactNode } from 'react';
import type { ButtonProps } from '../Button/Button.shared';
import type { AccountNumberFieldProps, AmountFieldProps, PhoneFieldProps } from '../inputs/fields.shared';
import { formatAmount, isValidAccountNumber, isValidIndianMobile } from '../inputs/format';
import type { OtpFieldProps } from '../OtpField/OtpField.shared';
import type { FieldHandle, TextFieldProps } from '../TextField/TextField.shared';

/** Props AutoForm sets on every field itself */
type Wired = 'value' | 'defaultValue' | 'onChangeText' | 'error' | 'ref' | 'onSubmitEditing';

interface Rules {
  /** Key of this field in the submitted values */
  name: string;
  /** Shows an error when left empty */
  required?: boolean;
  /** Name of another field this one must equal, like a confirm account number */
  matches?: string;
  /** Your own check: return an error message, or nothing when the value is fine. Runs after the built-in checks */
  validate?: (value: string, values: Record<string, string>) => string | undefined;
  /** Starting value */
  defaultValue?: string;
}

/** One field of an AutoForm: its type, its rules, and any props of the matching component */
export type AutoFormField =
  | (Rules & { type: 'text' | 'email' | 'password' } & Omit<TextFieldProps, Wired>)
  | (Rules & { type: 'phone' } & Omit<PhoneFieldProps, Wired>)
  | (Rules & {
      type: 'amount';
      /** Smallest amount allowed */
      min?: number;
      /** Largest amount allowed */
      max?: number;
    } & Omit<AmountFieldProps, Wired>)
  | (Rules & { type: 'account' } & Omit<AccountNumberFieldProps, Wired>)
  | (Rules & { type: 'otp' } & Omit<OtpFieldProps, Wired>);

/** Submitted values, keyed by field name. Amounts are plain number strings like "1234.50" */
export type FormValues<F extends readonly AutoFormField[]> = Record<F[number]['name'], string>;

export type FormErrors<F extends readonly AutoFormField[]> = Partial<FormValues<F>>;

/** Keeps the field names as literal types, so `onSubmit` knows exactly which values it gets */
export const defineFields = <const F extends readonly AutoFormField[]>(fields: F) => fields;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function typeError(field: AutoFormField, value: string) {
  switch (field.type) {
    case 'email':
      return emailPattern.test(value) ? undefined : 'Enter a valid email address';
    case 'phone':
      // ponytail: only +91 numbers are checked; other countries need libphonenumber-sized rules
      return (field.countryCode ?? '+91') !== '+91' || isValidIndianMobile(value)
        ? undefined
        : 'Enter a valid 10-digit mobile number';
    case 'amount': {
      const currency = field.currency ?? '₹';
      if (field.min !== undefined && Number(value) < field.min) {
        return `Minimum amount is ${currency} ${formatAmount(String(field.min))}`;
      }
      if (field.max !== undefined && Number(value) > field.max) {
        return `Maximum amount is ${currency} ${formatAmount(String(field.max))}`;
      }
      return undefined;
    }
    case 'account':
      return isValidAccountNumber(value) ? undefined : 'Enter a valid account number';
    case 'otp': {
      const length = field.length ?? 6;
      return value.length === length ? undefined : `Enter the ${length}-digit code`;
    }
  }
  return undefined;
}

/**
 * Errors for every field that has one. Checks run in order: required, the type's own check
 * (mobile number, amount limits, account number, OTP length, email), `matches`, then `validate`.
 * Pure, so a server can run the same checks on the same field list
 */
export function validateForm<F extends readonly AutoFormField[]>(fields: F, values: Record<string, string>) {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const value = values[field.name] ?? '';
    let error: string | undefined;
    if (!value) {
      // OTP labels are usually instructions ("Enter OTP"), so say how many digits instead
      error = !field.required ? undefined : field.type === 'otp' ? typeError(field, value) : `${field.label} is required`;
    } else {
      error = typeError(field, value);
      if (!error && field.matches !== undefined && value !== values[field.matches]) {
        const other = fields.find((item) => item.name === field.matches);
        error = `Must match ${other?.label ?? field.matches}`;
      }
      error ??= field.validate?.(value, values);
    }
    if (error) {
      errors[field.name] = error;
    }
  }
  return errors as FormErrors<F>;
}

export interface AutoFormProps<F extends readonly AutoFormField[]> {
  fields: F;
  /**
   * Called with every value once all fields pass. While it runs, the submit button shows a spinner.
   * Return `{ fieldName: message }` to show errors from your server on those fields
   */
  onSubmit: (values: FormValues<F>) => void | FormErrors<F> | Promise<void | FormErrors<F>>;
  /** @default 'Submit' */
  submitLabel?: string;
  /** Id for tests, on the form. The submit button gets `${testID}-submit` */
  testID?: string;
}

interface PlatformComponents {
  Form: ComponentType<{ children: ReactNode; testID?: string }>;
  Button: ComponentType<ButtonProps>;
  TextField: ComponentType<TextFieldProps>;
  PhoneField: ComponentType<PhoneFieldProps>;
  AmountField: ComponentType<AmountFieldProps>;
  AccountNumberField: ComponentType<AccountNumberFieldProps>;
  OtpField: ComponentType<OtpFieldProps>;
}

type FieldProps = Omit<TextFieldProps, 'label'> & { label: string; onBlur?: () => void };

export function createAutoForm(ui: PlatformComponents) {
  // Each config was type-checked against its component's props in AutoFormField
  const components = {
    text: ui.TextField,
    email: ui.TextField,
    password: ui.TextField,
    phone: ui.PhoneField,
    amount: ui.AmountField,
    account: ui.AccountNumberField,
    otp: ui.OtpField,
  } as Record<AutoFormField['type'], ComponentType<FieldProps>>;
  const presets: Partial<Record<AutoFormField['type'], Partial<TextFieldProps>>> = {
    email: { inputMode: 'email', autoComplete: 'email' },
    password: { secureTextEntry: true, autoComplete: 'current-password' },
  };

  return function AutoForm<const F extends readonly AutoFormField[]>({
    fields,
    onSubmit,
    submitLabel = 'Submit',
    testID,
  }: AutoFormProps<F>) {
    const [edited, setEdited] = useState<Record<string, string>>({});
    const [visited, setVisited] = useState<Record<string, boolean>>({});
    const [submitted, setSubmitted] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string | undefined>>({});
    const [submitting, setSubmitting] = useState(false);
    const busy = useRef(false);
    const handles = useRef<Record<string, FieldHandle | null>>({});

    const values: Record<string, string> = Object.fromEntries(
      fields.map((field) => [field.name, edited[field.name] ?? field.defaultValue ?? ''])
    );
    const errors: Record<string, string | undefined> = validateForm(fields, values);

    /** Focuses the first field with an error; false when there is none */
    const focusFirst = (found: Record<string, string | undefined>) => {
      const first = fields.find((field) => found[field.name]);
      if (first) {
        handles.current[first.name]?.focus();
      }
      return !!first;
    };

    const submit = async () => {
      // A ref, not state, so a double tap in the same frame cannot submit twice
      if (busy.current) {
        return;
      }
      setSubmitted(true);
      if (focusFirst(errors)) {
        return;
      }
      busy.current = true;
      setSubmitting(true);
      try {
        const result = await onSubmit(values as FormValues<F>);
        if (result) {
          setServerErrors(result);
          focusFirst(result);
        }
      } finally {
        busy.current = false;
        setSubmitting(false);
      }
    };

    return (
      <ui.Form testID={testID}>
        {fields.map((field, index) => {
          const { name, type, matches, validate, defaultValue, min, max, onBlur, ...props } = field as AutoFormField & {
            min?: number;
            max?: number;
            onBlur?: () => void;
          };
          const Field = components[type];
          const next = fields[index + 1];
          return (
            <Field
              key={name}
              {...presets[type]}
              {...props}
              ref={(handle: FieldHandle | null) => {
                handles.current[name] = handle;
              }}
              value={values[name]}
              onChangeText={(value: string) => {
                setEdited((current) => ({ ...current, [name]: value }));
                setServerErrors((current) => ({ ...current, [name]: undefined }));
              }}
              onBlur={() => {
                setVisited((current) => ({ ...current, [name]: true }));
                onBlur?.();
              }}
              onSubmitEditing={() => (next ? handles.current[next.name]?.focus() : submit())}
              error={serverErrors[name] ?? (submitted || visited[name] ? errors[name] : undefined)}
            />
          );
        })}
        <ui.Button fullWidth loading={submitting} onPress={submit} testID={testID ? `${testID}-submit` : undefined}>
          {submitLabel}
        </ui.Button>
      </ui.Form>
    );
  };
}
