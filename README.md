# @shivastu/ui

A design system for **React and React Native from one package**. Same component API, same design tokens, native rendering on each platform: a real `<button>` with CSS on the web, `Pressable` and `StyleSheet` on iOS and Android.

```tsx
import { Button, ThemeProvider } from '@shivastu/ui';

<ThemeProvider colorScheme="dark">
  <Button onPress={pay} loading={paying}>
    Pay now
  </Button>
</ThemeProvider>
```

The same code runs in a Vite or Next.js app and in an Expo or React Native app. No `react-native-web`, no bundler config.

## Packages

| Package | What it is |
| --- | --- |
| [`@shivastu/tokens`](packages/tokens) | Colors (light and dark), typography, spacing and radius. The single source of truth, with WCAG AA contrast checked in tests. |
| [`@shivastu/ui`](packages/ui) | Components and `ThemeProvider`, built on the tokens. |
| [`apps/docs`](apps/docs) | Storybook for the web components, with a light/dark toolbar switch. |
| [`apps/native-demo`](apps/native-demo) | Expo app that uses the same components on iOS and Android. |

## How one package serves both platforms

```
src/
├─ index.ts              web entry   → *.web.tsx files
├─ index.native.ts       native entry → *.native.tsx files
└─ Button/
   ├─ Button.shared.ts   props and sizes, shared by both
   ├─ Button.web.tsx     <button> + CSS classes
   ├─ Button.css.ts      web styles generated from tokens
   └─ Button.native.tsx  Pressable + StyleSheet
```

- `package.json` exports the native entry under the `react-native` condition, which Metro uses. Every other bundler gets the web entry.
- Each entry imports its platform files explicitly, so every import in the build is fully specified ESM. It loads in Metro, Vite, webpack/Next.js and plain Node.
- On the web, `ThemeProvider` renders one deduplicated React 19 `<style>` tag with CSS variables per color scheme plus the component styles. There are no CSS files to import, and it works with SSR. Web components are marked `'use client'` for the Next.js App Router.
- On native, `ThemeProvider` is a context; components read colors and fonts from it.

## Usage

```sh
npm install @shivastu/ui
```

**Web:** load Inter (for example from Google Fonts) and wrap your app:

```tsx
<ThemeProvider colorScheme="light">{children}</ThemeProvider>
```

**React Native:** load the Inter weights with `expo-font`, then pass their names so text uses them (otherwise the system font is used):

```tsx
import { tokens } from '@shivastu/ui';

<ThemeProvider colorScheme={scheme} fonts={tokens.fontFamily.native}>
  {children}
</ThemeProvider>
```

### Button

| Prop | Type | Default |
| --- | --- | --- |
| `children` | `string` | |
| `onPress` | `() => void` | |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `loading` | `boolean`: shows a spinner, marks the button busy, blocks presses | |
| `disabled` | `boolean` | |
| `fullWidth` | `boolean` | |
| `accessibilityLabel` | `string` | the label |
| `testID` | `string`: `data-testid` on web, `testID` on native | |

## Development

```sh
npm install
npm run build        # tokens, then ui
npm test             # token contrast + web (Vitest) + native (Jest) tests
npm run typecheck
npm run storybook    # web docs on http://localhost:6007
npm run native       # Expo dev server, open in Expo Go
```

## Roadmap

TextInput, OTP / PIN input, BottomSheet, Snackbar, then automated releases with Changesets.

## License

MIT
