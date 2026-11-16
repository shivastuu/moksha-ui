import type { ReactNode } from 'react';
import { alpha, mix, type SemanticColors } from 'tandemui-tokens';

export type BankCardFinish = 'brand' | 'midnight' | 'metal';

export const bankCardFinishes: BankCardFinish[] = ['brand', 'midnight', 'metal'];

export interface BankCardProps {
  /** Last four digits, shown on the front */
  last4: string;
  /** Cardholder name */
  holder: string;
  /** Expiry as printed, like "08/29" */
  expiry: string;
  /** Product or bank name in the top corner @default 'Tandem' */
  label?: string;
  /** @default 'brand' */
  finish?: BankCardFinish;
  /** Shows the back of the card, with the signature strip and CVV */
  flipped?: boolean;
  /** CVV on the back. Pass the real digits only when the user asked to see them @default '•••' */
  cvv?: string;
  /** Frosts the card and says it is frozen */
  frozen?: boolean;
  /** Card network mark in the bottom corner. Bring your own: network logos are trademarks */
  network?: ReactNode;
  /** Tilts toward the pointer or finger @default true */
  interactive?: boolean;
  testID?: string;
}

export const cardLabel = ({ label = 'Tandem', last4, holder, expiry, frozen }: BankCardProps) =>
  `${label} card ending in ${last4}, ${holder}, expires ${expiry}${frozen ? ', frozen' : ''}`;

/**
 * Colors of each finish, the chip and the holographic band. A card is a physical object, so these
 * come from the light scheme in both schemes. The gradients are CSS that React Native also reads
 */
export function bankCardColors(light: SemanticColors) {
  const { primary, primaryPressed, textOnPrimary: white, surfaceInverse: ink, textInverse, success, warning, danger } = light;
  const glow = mix(white, primary, 0.32);
  const depth = mix(ink, primaryPressed, 0.55);
  const steel = (amount: number) => mix(white, ink, amount);
  const band = (color: string) => alpha(mix(white, color, 0.45), 0.5);

  return {
    brand: {
      background: `radial-gradient(130% 120% at 0% 0%, ${glow} 0%, ${alpha(glow, 0)} 55%), radial-gradient(120% 130% at 100% 100%, ${depth} 0%, ${alpha(depth, 0)} 65%), linear-gradient(135deg, ${primary}, ${primaryPressed})`,
      ink: white,
    },
    midnight: {
      background: `radial-gradient(90% 120% at 100% 0%, ${alpha(primary, 0.55)} 0%, ${alpha(primary, 0)} 60%), radial-gradient(80% 110% at 0% 100%, ${alpha(success, 0.3)} 0%, ${alpha(success, 0)} 60%), linear-gradient(160deg, ${mix(primary, ink, 0.14)}, ${ink})`,
      ink: textInverse,
    },
    metal: {
      background: `linear-gradient(135deg, ${steel(0.72)}, ${steel(0.5)} 45%, ${steel(0.78)} 70%, ${steel(0.55)})`,
      ink,
    },
    chip: `linear-gradient(135deg, ${mix(white, warning, 0.55)}, ${warning} 45%, ${mix(ink, warning, 0.25)})`,
    chipLine: alpha(ink, 0.28),
    holo: `linear-gradient(110deg, ${alpha(white, 0)} 25%, ${band(danger)} 38%, ${band(warning)} 45%, ${band(success)} 52%, ${band(primary)} 59%, ${alpha(white, 0)} 72%)`,
    glare: `radial-gradient(circle at center, ${alpha(white, 0.6)} 0%, ${alpha(white, 0)} 62%)`,
    stripe: mix(primaryPressed, ink, 0.15),
    signature: mix(ink, white, 0.08),
    frost: alpha(white, 0.22),
    frozenPill: alpha(ink, 0.62),
    frozenText: white,
    // Web only, since React Native has no repeating gradients: brushed lines on metal, and fine engraved
    // rings from the bottom-right corner, like the guilloche on premium cards
    brushed: `repeating-linear-gradient(90deg, ${alpha(white, 0.07)} 0px, ${alpha(white, 0)} 1px, ${alpha(white, 0)} 3px)`,
    pattern: `repeating-radial-gradient(circle at 115% 125%, ${alpha(white, 0)} 0px, ${alpha(white, 0)} 7px, ${alpha(white, 0.09)} 7px, ${alpha(white, 0.09)} 8px)`,
  };
}
