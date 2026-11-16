import type { ReactNode } from 'react';
import { alpha, hexToOklch, type BlurToken, type RadiusToken, type SemanticColors, type ShadowName, type SpaceToken } from '@moksha-ui/tokens';

export type SurfaceVariant = 'solid' | 'raised' | 'glass';

export interface SurfaceProps {
  children?: ReactNode;
  /** `solid`: surface color with a border. `raised`: floating, with a shadow. `glass`: translucent over a backdrop blur @default 'solid' */
  variant?: SurfaceVariant;
  /** Inner padding from the spacing scale @default 'lg' */
  padding?: SpaceToken;
  /** Corner radius from the radius scale @default 'lg' */
  radius?: RadiusToken;
  /** Glass only: how strongly the backdrop is blurred @default 'md' */
  blur?: BlurToken;
  /** Shadow from the theme. Defaults to `md` for raised and glass, `none` for solid */
  shadow?: ShadowName | 'none';
  /** Id for tests: `data-testid` on web, `testID` on native */
  testID?: string;
}

export function resolveShadow(variant: SurfaceVariant, shadow?: ShadowName | 'none') {
  return shadow ?? (variant === 'solid' ? 'none' : 'md');
}

/** A hairline edge for raised surfaces, and the light catching the top of glass. Near-white in both schemes */
export function surfaceColors({ text, background }: SemanticColors) {
  const light = hexToOklch(text).l > hexToOklch(background).l ? text : background;
  return {
    edge: alpha(text, 0.08),
    highlight: alpha(light, 0.5),
    sheen: `linear-gradient(180deg, ${alpha(light, 0.1)}, ${alpha(light, 0)} 45%)`,
  };
}
