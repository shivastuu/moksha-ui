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
});
