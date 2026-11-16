/** A physical spring, the same numbers React Native's `Animated.spring` takes */
export interface Spring {
  stiffness: number;
  damping: number;
  mass: number;
}

const step = 1 / 1000;
const settled = (position: number, velocity: number) => Math.abs(position - 1) < 0.001 && Math.abs(velocity) < 0.01;

/**
 * The spring's motion from 0 to 1 as CSS: a `linear()` easing and how long it takes to settle, in ms.
 * Web animations with these values move like `Animated.spring` with the same spring on React Native
 */
export function springCurve({ stiffness, damping, mass }: Spring, points = 48) {
  const positions = [0];
  let position = 0;
  let velocity = 0;
  // ponytail: fixed-step simulation, 1 ms steps for at most 5 s; plenty for UI springs
  while (positions.length < 5000 && !settled(position, velocity)) {
    velocity += ((-stiffness * (position - 1) - damping * velocity) / mass) * step;
    position += velocity * step;
    positions.push(position);
  }
  const duration = positions.length - 1;
  const samples = Array.from({ length: points + 1 }, (_, index) => {
    const value = positions[Math.round((index / points) * duration)] ?? 1;
    return index === points ? 1 : Math.round(value * 10000) / 10000;
  });
  return { easing: `linear(${samples.join(', ')})`, duration };
}
