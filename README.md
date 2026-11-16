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
| [`@shivastu/tokens`](packages/tokens) | The theme: one file with every color (light and dark), type style, spacing, radius, shadow, motion and component size. WCAG AA contrast is checked in tests. |
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

## Theme

Every design value lives in one file: [`packages/tokens/src/theme.ts`](packages/tokens/src/theme.ts). Change it and both web and native update.

| Export | What it holds |
| --- | --- |
| `palette` | Raw color scales (violet, slate, green, amber, red). Components never use these directly. |
| `themes.light` / `themes.dark` | Semantic `colors` and `shadows` for each color scheme |
| `foundations` | `typography` (families, weights, sizes, line heights, letter spacing, `textStyles`), `space`, `radius`, `borderWidth`, `opacity`, `focusRing`, `motion`, `glass`, `zIndex`, `breakpoints` |
| `components` | Component decisions built from the above (button sizes, radius, gap) |
| `createTheme(options)` | Your own theme: a brand color plus any overrides (see below) |
| `getTheme(scheme)` | The default theme resolved for `'light'` or `'dark'` |

In components, `useTheme()` returns that resolved theme on both platforms:

```tsx
const { colors, space, radius, shadows, typography } = useTheme();
```

On the web, every token is also a CSS variable inside `ThemeProvider`, so your own CSS can use them:

```css
.card {
  background: var(--ds-color-surface-raised);
  padding: var(--ds-space-lg);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-md);
  transition: transform var(--ds-duration-fast) var(--ds-easing-standard);
}
```

Semantic colors are named by role and grouped by prefix, so autocomplete shows related ones together:

| Group | Tokens |
| --- | --- |
| Backgrounds | `background`, `surface`, `surfaceRaised`, `surfaceInverse`, `glassSurface`, `glassBorder` |
| Text | `text`, `textMuted`, `textOnPrimary`, `textInverse` |
| Brand | `primary`, `primaryPressed`, `primarySubtle` |
| Status | `success`, `warning`, `danger` |
| Other | `border`, `focusRing`, `overlay` |

Shadows are CSS `box-shadow` strings, used as is on the web and as `boxShadow` on React Native 0.76+.

## Customize

Give one brand color and `createTheme` builds the rest: a 10-step scale (generated in OKLCH so steps look even), and the primary tokens for light and dark. Every step is picked to pass WCAG AA, and your exact color is kept in the scale. Tests run this on 12 very different brand colors, from yellow to near-black.

```tsx
import { ThemeProvider, createTheme } from '@shivastu/ui';

const theme = createTheme({
  brandColor: '#0E7C66',
  colors: { light: { primary: '#0E7C66' } }, // any semantic color, per scheme
  foundations: {
    radius: { md: 12 },
    typography: { fontFamily: { web: 'Manrope, sans-serif' } },
  },
  components: { button: { sizes: { md: { height: 48 } } } },
});

<ThemeProvider theme={theme} colorScheme="dark">
  <App />
</ThemeProvider>
```

- Every option is optional; anything you leave out keeps the default.
- Overriding `primary` on its own recomputes `textOnPrimary` so text stays readable.
- A nested `ThemeProvider` keeps its parent's theme, so `<ThemeProvider colorScheme="dark">` inside a branded section only switches the scheme.
- Several themes can live on one page: each theme's CSS variables are scoped to its own provider.
- Storybook has a **Theme builder** page: pick a color and see the scale and both schemes live.

## Glass

`Surface` has three variants: `solid`, `raised` and `glass`. Glass is a translucent fill over a backdrop blur, with a hairline border, in both color schemes.

- **Web:** `backdrop-filter` with the theme's blur and saturation. Browsers without it, and users who turn on "reduce transparency", get a solid surface instead.
- **React Native:** pass a blur view once and every glass surface uses it. Without it, glass falls back to a solid raised surface, so `@shivastu/ui` doesn't force a native module on your app.

```tsx
import { BlurView } from 'expo-blur';

<ThemeProvider colorScheme={scheme} blurView={BlurView}>
  <Surface variant="glass" blur="lg" padding="xl" radius="xl">…</Surface>
</ThemeProvider>
```

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
import { foundations } from '@shivastu/ui';

<ThemeProvider colorScheme={scheme} fonts={foundations.typography.fontFamily.native}>
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

### Surface

| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `'solid' \| 'raised' \| 'glass'` | `'solid'` |
| `padding` | spacing token: `'xs'` … `'3xl'` | `'lg'` |
| `radius` | radius token: `'sm'` … `'full'` | `'lg'` |
| `blur` | glass only: `'sm' \| 'md' \| 'lg'` | `'md'` |
| `shadow` | `'none' \| 'sm' \| 'md' \| 'lg'` | `md` for raised and glass, none for solid |
| `testID` | `string` | |

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

- **Inputs:** TextInput, OTP / PIN input, phone, amount and account-number inputs, search
- **Overlays and feedback:** Dialog (becomes a bottom sheet on small screens), BottomSheet, Snackbar, Banner
- **Navigation:** AppBar, NavigationBar (horizontal, vertical, drawer, rail), Timeline
- **Interaction:** TapToCopy, SwipeButton, Confetti, FileUpload, DatePicker, Avatar / logo
- Automated releases with Changesets

## License

MIT
