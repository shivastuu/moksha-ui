import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Motion } from '../motion/Motion.native';
import { useTheme } from '../theme/context';
import { textStyleFor } from '../theme/textStyle';
import type { BottomSheetProps, DialogProps } from './Dialog.shared';

/** A modal dialog. Android back and a tap outside close it, unless `dismissible` is false */
export function Dialog({
  open,
  onClose,
  title,
  children,
  actions,
  presentation = 'auto',
  dismissible = true,
  testID,
}: DialogProps) {
  const theme = useTheme();
  const { colors, components, space, radius, shadows, breakpoints } = theme;
  const { modal } = components;
  const { width } = useWindowDimensions();
  const sheet = presentation === 'sheet' || (presentation === 'auto' && width < breakpoints.sm);
  const close = () => {
    if (dismissible) {
      onClose();
    }
  };

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <View style={[styles.fill, { justifyContent: sheet ? 'flex-end' : 'center', padding: sheet ? 0 : space.lg }]}>
        <Pressable
          accessibilityLabel="Close"
          disabled={!dismissible}
          onPress={close}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
        />
        <Motion preset={sheet ? 'slideUp' : 'scaleIn'}>
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
              boxShadow: shadows.lg,
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
            <Text accessibilityRole="header" style={[textStyleFor(theme, 'title'), { color: colors.text }]}>
              {title}
            </Text>
            {typeof children === 'string' ? (
              <Text style={[textStyleFor(theme, 'body'), { color: colors.textMuted }]}>{children}</Text>
            ) : (
              children
            )}
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

const styles = StyleSheet.create({ fill: { flex: 1 } });
