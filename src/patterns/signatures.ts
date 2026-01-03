import type { PatternDefinition } from '../types.js';

/**
 * Detectors for auto-generated signatures (NOT human sign-offs)
 */
export const AUTO_SIGNATURE_PATTERNS: PatternDefinition[] = [
  {
    pattern: /^--$/,
    description: 'RFC signature delimiter',
    example: '--',
  },
  {
    pattern: /^Sent from my\s/i,
    description: 'Mobile device tagline',
    example: 'Sent from my iPhone',
  },
  {
    pattern: /^Get Outlook for\s/i,
    description: 'Email client promotion',
    example: 'Get Outlook for Android',
  },
  {
    pattern: /^Sent (via|with)\s/i,
    description: 'Third-party app tagline',
    example: 'Sent via Superhuman',
  },
  {
    pattern: /BOOK A MEETING/i,
    description: 'Calendar booking link',
    example: 'BOOK A MEETING: https://...',
  },
  {
    pattern: /^=+$/,
    description: 'Equals sign divider',
    example: '========',
  },
  {
    pattern: /^(CONFIDENTIAL|DISCLAIMER|NOTICE):/i,
    description: 'Legal notice header',
    example: 'CONFIDENTIAL: This email...',
  },
  {
    pattern: /confidential.*intended.*recipient/i,
    description: 'Legal boilerplate text',
    example: '...confidential and intended solely for the recipient...',
  },
];

export default AUTO_SIGNATURE_PATTERNS;
