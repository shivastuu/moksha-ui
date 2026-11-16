import { fireEvent, render, screen } from '@testing-library/react-native';
import { View } from 'react-native';
import { components, themes } from '@moksha-ui/tokens';
import { IconButton } from '../index';

describe('IconButton (native)', () => {
  it('is a round button named by its label', async () => {
    const onPress = jest.fn();
    await render(<IconButton icon={<View testID="icon" />} accessibilityLabel="Send money" size="lg" onPress={onPress} testID="send" />);
    const button = screen.getByRole('button', { name: 'Send money' });
    const size = components.iconButton.sizes.lg;
    expect(screen.getByTestId('send')).toHaveStyle({ width: size, height: size, borderRadius: size / 2, backgroundColor: themes.light.colors.primarySubtle });
    expect(screen.getByTestId('icon')).toBeTruthy();
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('reports a toggle as selected and ignores presses while disabled', async () => {
    const onPress = jest.fn();
    await render(<IconButton icon={<View />} accessibilityLabel="Hide balance" pressed disabled onPress={onPress} />);
    const button = screen.getByRole('button', { name: 'Hide balance' });
    expect(button.props.accessibilityState).toMatchObject({ selected: true, disabled: true });
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
