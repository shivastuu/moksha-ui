import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Motion } from '../motion/Motion.native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useTheme } from '../theme/context';
import { textStyleFor } from '../theme/textStyle';
import { dialogColors, type BottomSheetProps, type DialogProps, type DrawerProps } from './Dialog.shared';

/** Slides the drawer in from its edge on the smooth spring */
function SlideIn({ from, children }: { from: number; children: ReactNode }) {
  const { motion } = useTheme();
  const reduced = useReducedMotion();
  const offset = useRef(new Animated.Value(from)).current;
  useEffect(() => {
    if (reduced !== false) {
      offset.setValue(0);
      return;
    }
    const spring = Animated.spring(offset, { toValue: 0, ...motion.spring.smooth, useNativeDriver: true });
    spring.start();
    return () => spring.stop();
  }, [reduced, offset, motion]);
  return <Animated.View style={{ flex: 1, transform: [{ translateX: offset }] }}>{children}</Animated.View>;
}

/** A modal dialog. Android back and a tap outside close it, unless `dismissible` is false */
export function Dialog({
  open,
  onClose,
  title,
  children,
  actions,
  presentation = 'auto',
  side = 'right',
  dismissible = true,
  testID,
}: DialogProps) {
  const theme = useTheme();
  const { colors, components, space, radius, shadows, breakpoints } = theme;
  const { modal } = components;
  const { width } = useWindowDimensions();
  const sheet = presentation === 'sheet' || (presentation === 'auto' && width < breakpoints.sm);
  const drawer = presentation === 'drawer';
  const drawerWidth = Math.min(400, width - space['3xl']);
  const close = () => {
    if (dismissible) {
      onClose();
    }
  };

  const header = (
    <Text accessibilityRole="header" style={[textStyleFor(theme, 'title'), { color: colors.text }]}>
      {title}
    </Text>
  );
  const body = typeof children === 'string' ? <Text style={[textStyleFor(theme, 'body'), { color: colors.textMuted }]}>{children}</Text> : children;

  if (drawer) {
    return (
      <Modal visible={open} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
        <View style={[styles.fill, { flexDirection: side === 'right' ? 'row-reverse' : 'row' }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" disabled={!dismissible} onPress={close} style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]} />
          <View style={{ width: drawerWidth }}>
            <SlideIn from={side === 'right' ? drawerWidth : -drawerWidth}>
              <View
                testID={testID}
                accessibilityViewIsModal
                onAccessibilityEscape={close}
                style={{
                  flex: 1,
                  gap: space.md,
                  padding: modal.padding,
                  // ponytail: fixed room for the status bar and home indicator; read safe-area insets for exact spacing
                  paddingTop: modal.padding + space['2xl'],
                  paddingBottom: modal.padding + space.lg,
                  [side === 'right' ? 'borderTopLeftRadius' : 'borderTopRightRadius']: modal.radius,
                  [side === 'right' ? 'borderBottomLeftRadius' : 'borderBottomRightRadius']: modal.radius,
                  backgroundColor: colors.surfaceRaised,
                  boxShadow: `${shadows.lg}, 0px 0px 0px 1px ${dialogColors(colors).edge}`,
                }}
              >
                {header}
                {body}
                {actions !== undefined ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: space.sm, marginTop: 'auto' }}>{actions}</View> : null}
              </View>
            </SlideIn>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <View style={[styles.fill, { justifyContent: sheet ? 'flex-end' : 'center', padding: sheet ? 0 : space.lg }]}>
        <Pressable
          accessibilityLabel="Close"
          disabled={!dismissible}
          onPress={close}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
        />
        <Motion preset={sheet ? 'slideUp' : 'scaleIn'} spring="smooth">
          <View
            testID={testID}
            accessibilityViewIsModal
            style={{
              alignSelf: 'center',
              width: '100%',
              maxWidth: sheet ? modal.sheetMaxWidth : modal.dialogMaxWidth,
              gap: space.md,
              padding: modal.padding,
              // ponytail: fixed room for the home indicator; read safe-area insets if a design needs exact spacing
              paddingBottom: sheet ? modal.padding + space.lg : modal.padding,
              borderRadius: modal.radius,
              borderBottomLeftRadius: sheet ? 0 : modal.radius,
              borderBottomRightRadius: sheet ? 0 : modal.radius,
              backgroundColor: colors.surfaceRaised,
              boxShadow: `${shadows.lg}, 0px 0px 0px 1px ${dialogColors(colors).edge}`,
            }}
          >
            {sheet ? (
              <View
                style={{
                  alignSelf: 'center',
                  width: modal.handleWidth,
                  height: modal.handleHeight,
                  marginTop: space.sm - modal.padding,
                  borderRadius: radius.full,
                  backgroundColor: colors.border,
                }}
              />
            ) : null}
            {header}
            {body}
            {actions !== undefined ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: space.sm, marginTop: space.sm }}>
                {actions}
              </View>
            ) : null}
          </View>
        </Motion>
      </View>
    </Modal>
  );
}

/** A panel that slides up from the bottom of the screen */
export function BottomSheet(props: BottomSheetProps) {
  return <Dialog {...props} presentation="sheet" />;
}

/** A full-height panel that slides in from the side, for filters, details or navigation */
export function Drawer(props: DrawerProps) {
  return <Dialog {...props} presentation="drawer" />;
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
