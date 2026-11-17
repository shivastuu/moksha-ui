import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useTheme } from '../theme/context';
import { useControllableState } from '../utils/useControllableState';
import { depthOf, stackLook, stackStep, type CardStackProps, type StackCard } from './CardStack.shared';

function Layer({ item, depth, count, onShow, onHeight }: { item: StackCard; depth: number; count: number; onShow: () => void; onHeight: (height: number) => void }) {
  const { components, motion } = useTheme();
  const reduced = useReducedMotion();
  const look = stackLook(depth);
  const y = useRef(new Animated.Value(look.y)).current;
  const scale = useRef(new Animated.Value(look.scale)).current;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (reduced !== false) {
      y.setValue(look.y);
      scale.setValue(look.scale);
      return;
    }
    const spring = Animated.parallel([
      Animated.spring(y, { toValue: look.y, ...motion.spring.smooth, useNativeDriver: true }),
      Animated.spring(scale, { toValue: look.scale, ...motion.spring.smooth, useNativeDriver: true }),
    ]);
    spring.start();
    return () => spring.stop();
  }, [look.y, look.scale, reduced, y, scale, motion]);

  return (
    <Animated.View
      onLayout={(event) => {
        setHeight(event.nativeEvent.layout.height);
        onHeight(event.nativeEvent.layout.height);
      }}
      style={{
        position: 'absolute',
        top: (count - 1) * stackStep.lift,
        left: 0,
        right: 0,
        zIndex: count - depth,
        // Scale from the top edge, so cards behind peek out above the front one
        transform: [{ translateY: Animated.add(y, Animated.multiply(Animated.subtract(scale, 1), height / 2)) }, { scale }],
        filter: depth ? [{ brightness: look.brightness }] : undefined,
      }}
    >
      <View accessibilityElementsHidden={depth > 0} importantForAccessibility={depth > 0 ? 'no-hide-descendants' : 'auto'} pointerEvents={depth > 0 ? 'none' : 'auto'}>
        {item.card}
      </View>
      {depth > 0 ? <Pressable accessibilityRole="button" accessibilityLabel={`Show ${item.label}`} onPress={onShow} style={[StyleSheet.absoluteFill, { borderRadius: components.bankCard.radius }]} /> : null}
    </Animated.View>
  );
}

/** Cards stacked like a wallet: the ones behind peek out above, and a tap on one springs it to the front */
export function CardStack({ cards, index, defaultIndex = 0, onIndexChange, accessibilityLabel = 'Your cards', testID }: CardStackProps) {
  const [front, setFront] = useControllableState(index, defaultIndex, onIndexChange);
  const [height, setHeight] = useState(0);
  const show = (position: number) => {
    setFront(position);
    AccessibilityInfo.announceForAccessibility(`Showing ${cards[position]!.label}`);
  };
  return (
    <View testID={testID} accessibilityLabel={accessibilityLabel} style={{ height: height + (cards.length - 1) * stackStep.lift }}>
      {cards.map((item, position) => (
        <Layer key={item.key} item={item} depth={depthOf(position, front, cards.length)} count={cards.length} onShow={() => show(position)} onHeight={(next) => next > height && setHeight(next)} />
      ))}
    </View>
  );
}
