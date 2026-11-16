import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { themes } from 'tandemui-tokens';
import { AutoForm, defineFields } from '../index';

const fields = defineFields([
  { name: 'mobile', type: 'phone', label: 'Mobile number', required: true },
  { name: 'amount', type: 'amount', label: 'Amount', required: true, max: 50000 },
  { name: 'otp', type: 'otp', label: 'Enter OTP', length: 4, required: true },
]);

describe('AutoForm (native)', () => {
  it('shows errors on submit, then submits the raw values once they pass', async () => {
    const onSubmit = jest.fn();
    await render(<AutoForm fields={fields} onSubmit={onSubmit} submitLabel="Pay" />);
    await fireEvent.changeText(screen.getByLabelText('Amount'), '75000');
    await fireEvent.press(screen.getByRole('button', { name: 'Pay' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Mobile number is required')).toHaveStyle({ color: themes.light.colors.danger });
    expect(screen.getByLabelText('Amount').props.accessibilityHint).toBe('Maximum amount is ₹ 50,000');
    expect(screen.getByText('Enter the 4-digit code')).toBeTruthy();

    await fireEvent.changeText(screen.getByLabelText('Mobile number'), '9876543210');
    await fireEvent.changeText(screen.getByLabelText('Amount'), '4999.99');
    await fireEvent.changeText(screen.getByLabelText('Enter OTP'), '4821');
    expect(screen.queryByText('Mobile number is required')).toBeNull();
    await act(async () => fireEvent.press(screen.getByRole('button', { name: 'Pay' })));

    expect(onSubmit).toHaveBeenCalledWith({ mobile: '9876543210', amount: '4999.99', otp: '4821' });
  });
});
