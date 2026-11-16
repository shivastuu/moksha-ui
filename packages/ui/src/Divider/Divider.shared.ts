export interface DividerProps {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Text in the middle of a horizontal divider, like "or continue with" */
  label?: string;
  testID?: string;
}
