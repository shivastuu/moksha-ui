import { act, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, View } from 'react-native';
import { components, foundations, themes } from '@moksha-ui/tokens';
import { fireEvent } from '@testing-library/react-native';
import { Badge, Chip, Divider, Skeleton, Spinner, Stack, Tag, Text } from './index';
import { chipColors } from './Chip/Chip.shared';
import { controlColors } from './utils/controls';
import { softTones, solidTones, textTones } from './utils/tones';

const settle = () => act(async () => {});

afterEach(() => jest.restoreAllMocks());

describe('primitives (native)', () => {
  it('Text uses the text style, an AA-safe tone, tighter tracking for headings and a line limit', async () => {
    await render(
      <Text variant="heading" tone="warning" numberOfLines={1} testID="t">
        KYC pending
      </Text>
    );
    const style = foundations.typography.textStyles.heading;
    const text = screen.getByTestId('t');
    expect(text).toHaveStyle({ fontSize: style.fontSize, color: textTones(themes.light.colors).warning, letterSpacing: -0.02 * style.fontSize });
    expect(text.props.numberOfLines).toBe(1);
  });

  it('Stack lays out with theme spacing', async () => {
    await render(
      <Stack direction="row" gap="xl" justify="between" testID="s">
        <View />
      </Stack>
    );
    expect(screen.getByTestId('s')).toHaveStyle({ flexDirection: 'row', gap: foundations.space.xl, justifyContent: 'space-between' });
  });

  it('Divider shows its label, and Spinner is a named progress indicator', async () => {
    await render(
      <>
        <Divider label="or" />
        <Spinner label="Loading offers" />
      </>
    );
    expect(screen.getByText('or')).toBeTruthy();
    expect(screen.getByLabelText('Loading offers').props.accessibilityRole).toBe('progressbar');
  });

  it('Skeleton draws hidden blocks, and no sweep with Reduce Motion', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    await render(<Skeleton lines={2} testID="sk" />);
    await settle();
    // Hidden from screen readers on purpose, so it can only be found with hidden elements included
    expect(screen.queryByTestId('sk')).toBeNull();
    const skeleton = screen.getByTestId('sk', { includeHiddenElements: true });
    expect(skeleton.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(skeleton.children).toHaveLength(2);
  });

  it('Badge caps the count, reads it out, and hides at zero', async () => {
    const { rerender } = await render(<Badge count={250} tone="success" testID="b" />);
    expect(screen.getByText('99+')).toHaveStyle({ color: solidTones(themes.light.colors).success.ink });
    expect(screen.getByTestId('b')).toHaveStyle({ height: components.badge.size, backgroundColor: solidTones(themes.light.colors).success.background });
    expect(screen.getByLabelText('99+')).toBeTruthy();
    await rerender(<Badge count={0} testID="b" />);
    expect(screen.queryByTestId('b')).toBeNull();
  });

  it('Tag is a bordered pill in its tone', async () => {
    await render(<Tag tone="warning" testID="tag">KYC pending</Tag>);
    const tone = softTones(themes.light.colors).warning;
    expect(screen.getByTestId('tag')).toHaveStyle({ borderColor: tone.border, backgroundColor: tone.background });
    expect(screen.getByText('KYC pending')).toHaveStyle({ color: tone.ink });
  });

  it('Chip toggles, reports selected, and takes the brand border when chosen', async () => {
    const onSelectedChange = jest.fn();
    const { rerender } = await render(<Chip label="Travel" onSelectedChange={onSelectedChange} testID="chip" />);
    await fireEvent.press(screen.getByRole('button', { name: 'Travel' }));
    expect(onSelectedChange).toHaveBeenCalledWith(true);
    await rerender(<Chip label="Travel" selected onSelectedChange={onSelectedChange} testID="chip" />);
    expect(screen.getByRole('button', { name: 'Travel' }).props.accessibilityState).toMatchObject({ selected: true });
    expect(screen.getByTestId('chip')).toHaveStyle({ borderColor: chipColors(themes.light.colors).selectedBorder, backgroundColor: controlColors(themes.light.colors).selectedFill });
  });
});
