import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? sourceFiles(join(dir, entry.name))
      : /\.tsx?$/.test(entry.name) && !entry.name.includes('.test.')
        ? [join(dir, entry.name)]
        : []
  );

describe('components', () => {
  it('use theme tokens, never raw color values', () => {
    const offenders = sourceFiles(join(__dirname)).flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .map((line, index) => ({ line, at: `${file.replace(__dirname, 'src')}:${index + 1}` }))
        .filter(({ line }) => /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(line))
        .map(({ at, line }) => `${at}  ${line.trim()}`)
    );
    expect(offenders).toEqual([]);
  });
});
