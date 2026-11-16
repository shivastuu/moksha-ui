import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Button, Surface, ThemeProvider, createTheme, foundations, themes } from '../index';
import { surfaceColors } from './Surface.shared';

function FakeBlurView({
  intensity,
  tint,
  style,
  testID,
  children,
}: {
  intensity?: number;
  tint?: string;
  style?: any;
  testID?: string;
  children?: ReactNode;
}) {
  return (
    <View testID={testID} style={style} accessibilityHint={`blur ${intensity} ${tint}`}>
      {children}
    </View>
  );
}

describe('Surface (native)', () => {
  it('renders a solid surface with token padding, radius and border', async () => {
    await render(
      <Surface testID="card">
        <Text>Balance</Text>
      </Surface>
    );
    expect(screen.getByTestId('card')).toHaveStyle({
      padding: foundations.space.lg,
      borderRadius: foundations.radius.lg,
      backgroundColor: themes.light.colors.surface,
      borderColor: themes.light.colors.border,
    });
  });

  it('renders glass through the blur view passed to ThemeProvider', async () => {
    await render(
      <ThemeProvider colorScheme="dark" blurView={FakeBlurView}>
        <Surface variant="glass" blur="lg" testID="card">
          <Text>Balance</Text>
        </Surface>
      </ThemeProvider>
    );
    const card = screen.getByTestId('card');
    expect(card.props.accessibilityHint).toBe(`blur ${Math.min(100, foundations.glass.blur.lg * 2)} dark`);
    expect(card).toHaveStyle({
      backgroundColor: themes.dark.colors.glassSurface,
      borderColor: themes.dark.colors.glassBorder,
      boxShadow: `${themes.dark.shadows.md}, inset 0px 1px 0px ${surfaceColors(themes.dark.colors).highlight}`,
      backgroundImage: surfaceColors(themes.dark.colors).sheen,
    });
  });

  it('falls back to a solid raised surface without a blur view', async () => {
    await render(
      <Surface variant="glass" testID="card">
        <Text>Balance</Text>
      </Surface>
    );
    expect(screen.getByTestId('card')).toHaveStyle({ backgroundColor: themes.light.colors.surfaceRaised });
  });
});

describe('custom themes (native)', () => {
  it('uses the brand color from createTheme and keeps it in a nested provider', async () => {
    const teal = createTheme({ brandColor: '#0E7C66', components: { button: { sizes: { md: { height: 50 } } } } });
    await render(
      <ThemeProvider theme={teal}>
        <ThemeProvider colorScheme="dark">
          <Button testID="pay">Pay now</Button>
        </ThemeProvider>
      </ThemeProvider>
    );
    expect(screen.getByTestId('pay')).toHaveStyle({
      backgroundColor: teal.themes.dark.colors.primary,
      minHeight: 50,
    });
  });
});
