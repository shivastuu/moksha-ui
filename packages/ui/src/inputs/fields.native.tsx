import { SearchIcon } from '../Icon/SearchIcon.native';
import { TextField } from '../TextField/TextField.native';
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
