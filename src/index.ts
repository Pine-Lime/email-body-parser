/**
 * email-body-parser
 *
 * Parse and clean email content - removes quotes, auto-signatures,
 * and mailing list footers while preserving human signatures.
 *
 * @module
 * @example
 * // Simple API
 * import { cleanEmailContent } from '@pinenlime/email-body-parser';
 * const cleaned = cleanEmailContent(rawEmail);
 *
 * @example
 * // Advanced API
 * import { EmailBodyParser } from '@pinenlime/email-body-parser';
 * const parser = new EmailBodyParser();
 * const email = parser.parse(rawEmail);
 * console.log(email.getVisibleText());
 */

// Main exports
export { cleanEmailContent } from './cleaner.ts';
export { EmailBodyParser } from './parser.ts';
export { default } from './parser.ts';

// Pattern exports (for advanced users who want to customize)
export { QUOTE_PATTERNS } from './patterns/quotes.ts';
export { AUTO_SIGNATURE_PATTERNS } from './patterns/signatures.ts';
export { MAILING_LIST_PATTERNS } from './patterns/footers.ts';

// Type exports
export type {
  EmailFragment,
  ParsedEmail,
  PatternDefinition,
  ParserOptions,
} from './types.ts';

