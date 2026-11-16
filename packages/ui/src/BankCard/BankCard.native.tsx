import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Text, View, type GestureResponderEvent, type ViewStyle } from 'react-native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { bankCardColors, cardLabel, type BankCardProps } from './BankCard.shared';

const ratio = 1.586;

/** Three arcs sharing one center, drawn with borders */
function Contactless({ size, color }: { size: number; color: string }) {
  const stroke = Math.max(1.5, size * 0.09);
  return (
    <View style={{ width: size, height: size, opacity: 0.85 }}>
      {[0.5, 0.95, 1.4].map((scale) => (
        <View
          key={scale}
          style={{
            position: 'absolute',
            width: size * scale,
            height: size * scale,
            left: size * 0.15 - (size * scale) / 2,
            top: (size - size * scale) / 2,
            borderRadius: (size * scale) / 2,
            borderRightWidth: stroke,
            borderColor: color,
          }}
        />
      ))}
    </View>
  );
}
const clamp = (value: number) => Math.max(-1, Math.min(1, value));

/** A payment card that tilts toward the finger, catches the light, flips to its back and can be frozen */
export function BankCard(props: BankCardProps) {
  const { last4, holder, expiry, label = 'Moksha', finish = 'brand', flipped, cvv = '•••', frozen, network, interactive = true, testID } = props;
  const theme = useTheme();
  const { components, motion, radius } = theme;
  const { bankCard } = components;
  const colors = bankCardColors(theme.definition.themes.light.colors);
  const { background, ink } = colors[finish];
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(bankCard.maxWidth);
  const tiltX = useRef(new Animated.Value(0)).current;
  const tiltY = useRef(new Animated.Value(0)).current;
  const light = useRef(new Animated.Value(0)).current;
  const turn = useRef(new Animated.Value(flipped ? 1 : 0)).current;

  useEffect(() => {
    if (reduced !== false) {
      turn.setValue(flipped ? 1 : 0);
      return;
    }
    const animation = Animated.spring(turn, { toValue: flipped ? 1 : 0, ...motion.spring.smooth, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [flipped, reduced, turn, motion]);

  const spring = (value: Animated.Value, toValue: number) =>
    Animated.spring(value, { toValue, ...motion.spring.snappy, useNativeDriver: true }).start();
  const follow = (event: GestureResponderEvent) => {
    spring(tiltX, clamp((event.nativeEvent.locationX / width) * 2 - 1));
    spring(tiltY, clamp((event.nativeEvent.locationY / (width / ratio)) * 2 - 1));
    spring(light, 1);
  };
  const rest = () => {
    spring(tiltX, 0);
    spring(tiltY, 0);
    spring(light, 0);
  };
  const tilts = interactive && reduced === false;

  // 1% of the card's width, so everything scales with the card like cqw on the web
  const u = width / 100;
  const degrees = (value: Animated.AnimatedInterpolation<number>, range: number) =>
    value.interpolate({ inputRange: [-range, range], outputRange: [`${-range}deg`, `${range}deg`] });
  const rotateY = Animated.add(Animated.multiply(tiltX, bankCard.tilt), Animated.multiply(turn, 180));
  const text = (size: number, weight: 'regular' | 'medium' | 'semibold', extra?: object) => ({
    color: ink,
    fontSize: size * u,
    ...fontFor(theme, weight),
    ...extra,
  });
  const caption = text(2.6, 'medium', { letterSpacing: 0.31 * u, textTransform: 'uppercase' as const, opacity: 0.7 });
  const face: ViewStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    borderRadius: bankCard.radius,
    backfaceVisibility: 'hidden',
    backgroundImage: background,
    boxShadow: theme.shadows.lg,
  };

  const lightLayers: ReactNode = (
    <>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: width * 3,
          backgroundImage: colors.holo,
          mixBlendMode: 'color-dodge',
          opacity: light.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.9] }),
          transform: [{ translateX: tiltX.interpolate({ inputRange: [-1, 1], outputRange: [0, -2 * width] }) }],
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          width: width * 1.3,
          height: width * 1.3,
          left: -0.15 * width,
          top: width / ratio / 2 - 0.65 * width,
          backgroundImage: colors.glare,
          mixBlendMode: 'overlay',
          opacity: light,
          transform: [
            { translateX: Animated.multiply(tiltX, width / 2) },
            { translateY: Animated.multiply(tiltY, width / ratio / 2) },
          ],
        }}
      />
      {frozen ? (
        <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.frost }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1.6 * u, paddingVertical: 1.8 * u, paddingHorizontal: 3.6 * u, borderRadius: radius.full, backgroundColor: colors.frozenPill }}>
            <Text style={text(3.6, 'semibold', { color: colors.frozenText })}>❄ Frozen</Text>
          </View>
        </View>
      ) : null}
    </>
  );

  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="image"
      accessibilityLabel={cardLabel(props)}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => tilts}
      onResponderGrant={follow}
      onResponderMove={follow}
      onResponderRelease={rest}
      onResponderTerminate={rest}
      onResponderTerminationRequest={() => true}
      style={{ width: '100%', maxWidth: bankCard.maxWidth, aspectRatio: ratio }}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          flex: 1,
          transform: [{ perspective: 1000 }, { rotateX: degrees(Animated.multiply(tiltY, -bankCard.tilt), bankCard.tilt) }, { rotateY: degrees(rotateY, 360) }],
        }}
      >
        <View testID={testID ? `${testID}-front` : undefined} style={[face, { padding: 6.5 * u, paddingHorizontal: 7 * u }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={text(5, 'semibold')}>{label}</Text>
            <Contactless size={7 * u} color={ink} />
          </View>
          <View
            style={{
              width: 13 * u,
              height: 10 * u,
              marginTop: 7 * u,
              borderRadius: 1.8 * u,
              borderWidth: 1,
              borderColor: colors.chipLine,
              backgroundImage: colors.chip,
            }}
          />
          <Text style={text(6.4, 'medium', { marginTop: 'auto', letterSpacing: 0.5 * u, fontVariant: ['tabular-nums'] })} numberOfLines={1}>
            •••• •••• •••• {last4}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 * u, marginTop: 4 * u }}>
            <View style={{ gap: 0.6 * u }}>
              <Text style={caption}>Card holder</Text>
              <Text style={text(4, 'semibold', { textTransform: 'uppercase' })} numberOfLines={1}>
                {holder}
              </Text>
            </View>
            <View style={{ gap: 0.6 * u }}>
              <Text style={caption}>Valid thru</Text>
              <Text style={text(4, 'semibold')}>{expiry}</Text>
            </View>
            {network !== undefined ? <View style={{ marginLeft: 'auto' }}>{network}</View> : null}
          </View>
          {lightLayers}
        </View>
        <View testID={testID ? `${testID}-back` : undefined} style={[face, { transform: [{ rotateY: '180deg' }] }]}>
          <View style={{ height: '19%', marginTop: '9%', backgroundColor: colors.stripe }} />
          <View
            style={{
              height: '15%',
              marginTop: '7%',
              marginHorizontal: '7%',
              paddingHorizontal: 3 * u,
              borderRadius: u,
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: colors.signature,
            }}
          >
            <Text style={text(4.2, 'semibold', { color: colors.stripe, fontStyle: 'italic', letterSpacing: 0.4 * u })}>{cvv}</Text>
          </View>
          <Text style={[caption, { marginTop: 'auto', marginHorizontal: '7%', marginBottom: 6.5 * u }]}>
            {label} · •••• {last4}
          </Text>
          {lightLayers}
        </View>
      </Animated.View>
    </View>
  );
}
