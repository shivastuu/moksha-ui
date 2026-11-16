import { useEffect, type ReactNode } from 'react';
import { AccessibilityInfo, Pressable, Text, View } from 'react-native';
import { Motion } from '../motion/Motion.native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { createSnackbarProvider, type SnackbarViewProps } from './Snackbar.shared';

function SnackbarView({ snackbar, onAction }: SnackbarViewProps) {
  const theme = useTheme();
  const { colors, components, space, shadows } = theme;
  const { snackbar: tokens } = components;
  const text = [textStyleFor(theme, 'bodySmall'), { color: colors.textInverse }];

  useEffect(() => {
    if (snackbar) {
      AccessibilityInfo.announceForAccessibility(snackbar.message);
    }
  }, [snackbar?.id]);

  if (!snackbar) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      // ponytail: fixed room for the home indicator; read safe-area insets if a design needs exact spacing
      style={{ position: 'absolute', left: space.lg, right: space.lg, bottom: tokens.offset + space.lg, alignItems: 'center' }}
    >
      <Motion key={snackbar.id} preset="slideUp" duration="fast">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: space.lg,
            maxWidth: tokens.maxWidth,
            paddingVertical: tokens.padding,
            paddingHorizontal: space.lg,
            borderRadius: tokens.radius,
            backgroundColor: colors.surfaceInverse,
            boxShadow: shadows.lg,
          }}
        >
          <Text style={[text, { flexShrink: 1 }]}>{snackbar.message}</Text>
          {snackbar.action ? (
            <Pressable accessibilityRole="button" hitSlop={space.sm} onPress={onAction}>
              <Text style={[text, fontFor(theme, 'semibold')]}>{snackbar.action.label}</Text>
            </Pressable>
          ) : null}
        </View>
      </Motion>
    </View>
  );
}

const Provider = createSnackbarProvider(SnackbarView);

/** Put it once near the root, inside ThemeProvider, then call `useSnackbar().show(...)` anywhere below */
export function SnackbarProvider({ children }: { children: ReactNode }) {
  // A full-screen box, so the snackbar sits at the bottom of the screen
  return (
    <View style={{ flex: 1 }}>
      <Provider>{children}</Provider>
    </View>
  );
}
