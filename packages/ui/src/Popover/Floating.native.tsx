import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions, type HostInstance } from 'react-native';
import { Motion } from '../motion/Motion.native';
import { placeFloating, type FloatingAlign, type FloatingSide, type Rect } from '../utils/floating';
import type { Anchor } from './Popover.shared';

interface FloatingProps {
  anchor: Anchor;
  open: boolean;
  onClose: () => void;
  side?: FloatingSide;
  align?: FloatingAlign;
  label?: string;
  role?: 'menu';
  testID?: string;
  children: ReactNode;
}

/** A panel in a transparent Modal, so no ScrollView clips it, placed next to its anchor measured in the window */
export function Floating({ anchor, open, onClose, side = 'bottom', align = 'start', label, role, testID, children }: FloatingProps) {
  const window = useWindowDimensions();
  const [box, setBox] = useState<Rect>();
  const [size, setSize] = useState<{ width: number; height: number }>();

  useEffect(() => {
    if (!open) {
      setBox(undefined);
      return;
    }
    (anchor.current as HostInstance | null)?.measureInWindow((x, y, width, height) => setBox({ x, y, width, height }));
  }, [open, anchor]);

  const place = box && size ? placeFloating(box, size, window, side, align) : undefined;
  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} style={StyleSheet.absoluteFill} />
      <View
        testID={testID}
        // VoiceOver ignores what's outside a modal view, so its escape gesture (two-finger scrub) closes it
        accessibilityViewIsModal
        onAccessibilityEscape={onClose}
        accessibilityRole={role}
        accessibilityLabel={label}
        onLayout={(event) => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}
        // Hidden until placed, so it never flashes in the corner
        style={{ position: 'absolute', left: place?.x ?? 0, top: place?.y ?? 0, maxWidth: window.width - 16, opacity: place ? 1 : 0 }}
      >
        {place ? (
          <Motion preset="scaleIn" spring="smooth">
            {children}
          </Motion>
        ) : (
          children
        )}
      </View>
    </Modal>
  );
}
