import assert from 'node:assert/strict';
import { test } from 'node:test';
import { springCurve } from './spring.ts';
import { foundations } from './theme.ts';

const values = (easing: string) => easing.slice('linear('.length, -1).split(', ').map(Number);

test('spring curves start at 0, end at 1, and settle in a UI-sized time', () => {
  for (const [name, spring] of Object.entries(foundations.motion.spring)) {
    const { easing, duration } = springCurve(spring);
    const points = values(easing);
    assert.equal(points[0], 0, name);
    assert.equal(points.at(-1), 1, name);
    assert.ok(duration > 150 && duration < 1500, `${name} settles in ${duration} ms`);
  }
});

test('overshoot matches the physics: bouncy springs past 1, smooth does not', () => {
  const peak = (name: keyof typeof foundations.motion.spring) => Math.max(...values(springCurve(foundations.motion.spring[name]).easing));
  // Damping ratio of bouncy is 16 / (2 * sqrt(300)) ≈ 0.46, so the textbook overshoot is exp(-ζπ/√(1-ζ²)) ≈ 19.5%
  assert.ok(Math.abs(peak('bouncy') - 1.195) < 0.01, `bouncy peaks at ${peak('bouncy')}`);
  assert.ok(peak('smooth') <= 1.001, `smooth peaks at ${peak('smooth')}`);
});
