import { useContext, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { ThemeContext } from './context';
import { buildTheme, type ThemeProviderProps } from './theme';

export function ThemeProvider({ theme, colorScheme = 'light', fonts, blurView, children }: ThemeProviderProps) {
  const parent = useContext(ThemeContext);
  const definition = theme ?? parent.definition;
  const nativeFonts = fonts ?? parent.nativeFonts;
  const solid = useReducedTransparency();
  // With Reduce Transparency on, glass gets no blur view and falls back to a solid surface, as on the web
  const blur = solid ? undefined : (blurView ?? parent.blurView);
  const value = useMemo(
    () => buildTheme(definition, colorScheme, nativeFonts, blur),
    [definition, colorScheme, nativeFonts, blur]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Whether the user turned on Reduce Transparency (iOS; always off on Android) */
function useReducedTransparency() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceTransparencyEnabled()
      .then((value) => {
        if (active) {
          setReduced(value);
        }
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduced);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
