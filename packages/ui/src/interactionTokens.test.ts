import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { componentCss } from './theme/css';

const cssFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? cssFiles(join(dir, entry.name)) : entry.name.endsWith('.css.ts') ? [join(dir, entry.name)] : []
  );

describe('interaction feel', () => {
  it('hover and press washes use the theme strengths, never raw numbers', () => {
    const offenders = cssFiles(__dirname).flatMap((file) =>
      [...readFileSync(file, 'utf8').matchAll(/([^{}]*:(?:hover|active)[^{}]*::before)\{([^{}]*)\}/g)]
        .filter(([, , body]) => /opacity:\s*0?\.\d/.test(body!))
        .map(([, selector]) => `${file.replace(__dirname, 'src')}: ${selector!.trim()}`)
    );
    expect(offenders).toEqual([]);
  });

  it('defines one shared press wash and gives, and one breath for loaders', () => {
    expect(componentCss).toContain('.ds-press:active:not(:disabled):not([aria-disabled=true])::before{opacity:var(--ds-opacity-pressed)}');
    expect(componentCss).toContain('.ds-press--object:active:not(:disabled):not([aria-disabled=true]){transform:scale(var(--ds-motion-scale-pressed))}');
    expect(componentCss).toContain('@keyframes ds-breathe{to{opacity:var(--ds-breathe-low)}}');
    expect(componentCss).toMatch(/\.ds-skeleton\{[^}]*animation:ds-breathe calc\(var\(--ds-breathe-period\) \/ 2\) var\(--ds-breathe-easing\) infinite alternate/);
    expect(componentCss).not.toContain('ds-shimmer');
  });

  it('hovers only with a real pointer, so a tapped control on a phone does not stay lit', () => {
    // The bank card is the one exception: its light follows a finger as well as a mouse
    const unguarded = componentCss
      .replace(/@media \(hover:hover\)\{(?:[^{}]*\{[^{}]*\})*\}/g, '')
      .match(/[^{}]*:hover[^{}]*(?=\{)/g)
      ?.map((selector) => selector.trim())
      .filter((selector) => !selector.startsWith('.ds-bank-card'));
    expect(unguarded ?? []).toEqual([]);
  });

  it('dims every disabled control by the theme amount, never a raw number', () => {
    const offenders = [...componentCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter(([, selector, body]) => /:disabled|aria-disabled|data-disabled|--disabled/.test(selector!) && /opacity:\s*0?\.\d/.test(body!))
      .map(([, selector]) => selector!.trim());
    expect(offenders).toEqual([]);
  });

  it('taps cleanly on phones: no tap flash or double-tap zoom on any control', () => {
    expect(componentCss).toMatch(/:where\(button,a,input,[^)]*\):is\(\[class\^="ds-"\],\[class\*=" ds-"\]\)\{-webkit-tap-highlight-color:transparent;touch-action:manipulation\}/);
  });

  it('keeps focus visible in forced colors, which drops shadows and recolors borders', () => {
    const rules = [...componentCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => [selector!.trim(), body!] as const);
    const haloWithoutRing = rules.filter(([, body]) => body.includes('var(--ds-field-halo)') && !body.includes('outline:'));
    const ringRemoved = rules.filter(([selector, body]) => selector.includes(':focus-visible') && /outline:(none|0)\b/.test(body));
    expect(haloWithoutRing.map(([selector]) => selector)).toEqual([]);
    expect(ringRemoved.map(([selector]) => selector)).toEqual([]);
  });

  it('keeps state indicators, the success check and the card edge drawn in forced colors, which repaints backgrounds as the page', () => {
    const forced = [...componentCss.matchAll(/@media \(forced-colors:active\)\{(.*)\}/g)].map(([, body]) => body).join('');
    for (const selector of ['.ds-switch[aria-checked=true]{', '.ds-radio__dot::after{', '.ds-segmented__indicator{', '.ds-sidebar__indicator{', '.ds-tabbar__indicator{', '.ds-tabs__indicator{', '.ds-progress__fill{', '.ds-badge--dot{', '.ds-avatar__status{', '.ds-success__check{', '.ds-bank-card__face{']) {
      expect(forced).toContain(selector);
    }
  });
});
