import type { PatternDefinition } from '../types.ts';

/**
 * Detectors for quoted/forwarded email content
 */
export const QUOTE_PATTERNS: PatternDefinition[] = [
  {
    pattern: /^>+/,
    description: 'Traditional quote prefix',
    example: '> previous message text',
  },
  {
    pattern: /^On\s.+\swrote:$/i,
    description: 'Reply attribution line',
    example: 'On March 17, 2025, John Smith wrote:',
  },
  {
    pattern: /^-+\s*Original Message\s*-+/i,
    description: 'Forwarded message header',
    example: '--- Original Message ---',
  },
  {
    pattern: /^From:.+Sent:.+$/i,
    description: 'Email metadata header',
    example: 'From: sender@mail.com Sent: Monday 3:00 PM',
  },
  {
    pattern: /From:.+Date:.+To:.+Subject:/i,
    description: 'Concatenated email headers',
    example: 'From: a@b.comDate: Jan 1To: c@d.comSubject: Hi',
  },
  {
    pattern: /^_{8,}$/,
    description: 'Underscore divider',
    example: '________________',
  },
  {
    pattern: /^[\u200b-\u200f\u202a-\u202e]/,
    description: 'Unicode control character divider',
    example: '(invisible characters)',
  },
];

export default QUOTE_PATTERNS;
