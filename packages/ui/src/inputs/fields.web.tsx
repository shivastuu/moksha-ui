'use client';

import { SearchIcon } from '../Icon/SearchIcon.web';
import { TextField } from '../TextField/TextField.web';
import {
  createAccountNumberField,
  createAmountField,
  createPhoneField,
  createSearchField,
} from './fields.shared';

export const PhoneField = createPhoneField(TextField);

export const AmountField = createAmountField(TextField);

export const AccountNumberField = createAccountNumberField(TextField);

export const SearchField = createSearchField(TextField, SearchIcon);
