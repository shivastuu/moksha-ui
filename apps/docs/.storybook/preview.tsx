import type { Preview } from '@storybook/react-vite';
import { ThemeProvider, type ColorScheme } from 'tandemui';

const preview: Preview = {
  globalTypes: {
    scheme: {
      description: 'Color scheme',
      toolbar: { title: 'Scheme', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { scheme: 'light' },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, { globals }) => (
      <ThemeProvider colorScheme={globals.scheme as ColorScheme}>
        <div
          style={{
            minHeight: '100vh',
            padding: 32,
            boxSizing: 'border-box',
            background: 'var(--ds-color-background)',
            color: 'var(--ds-color-text)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
