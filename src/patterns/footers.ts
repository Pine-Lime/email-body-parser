import type { PatternDefinition } from '../types.ts';

/**
 * Detectors for mailing list and newsletter footers
 */
export const MAILING_LIST_PATTERNS: PatternDefinition[] = [
  {
    pattern: /^You received this (message|email) because/i,
    description: 'Mailing list attribution',
    example: 'You received this message because you are subscribed...',
  },
  {
    pattern: /^To (unsubscribe|stop receiving)/i,
    description: 'Unsubscribe instruction',
    example: 'To unsubscribe, click here',
  },
  {
    pattern: /^To view this (discussion|thread)/i,
    description: 'Web view link',
    example: 'To view this discussion online...',
  },
  {
    pattern: /^(Manage|Update) your (subscription|preferences)/i,
    description: 'Preferences link',
    example: 'Manage your subscription settings',
  },
  {
    pattern: /^This email was sent to\s/i,
    description: 'Recipient notice',
    example: 'This email was sent to user@example.com',
  },
  {
    pattern: /^(Click|Tap) here to unsubscribe/i,
    description: 'Unsubscribe CTA',
    example: 'Click here to unsubscribe',
  },
  {
    pattern: /^If you (no longer|don't) (wish|want) to receive/i,
    description: 'Opt-out notice',
    example: "If you no longer wish to receive these emails...",
  },
];

export default MAILING_LIST_PATTERNS;
