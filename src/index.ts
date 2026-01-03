/**
 * email-body-parser
 *
 * Parse and clean email content - removes quotes, auto-signatures,
 * and mailing list footers while preserving human signatures.
 *
 * @example
 * // Simple API
 * import { cleanEmailContent } from 'email-body-parser';
 * const cleaned = cleanEmailContent(rawEmail);
 *
 * @example
 * // Advanced API
 * import EmailBodyParser from 'email-body-parser';
 * const parser = new EmailBodyParser();
 * const email = parser.parse(rawEmail);
 * console.log(email.getVisibleText());
 */

// Main exports
export { cleanEmailContent } from './cleaner.js';
export { EmailBodyParser } from './parser.js';
export { default } from './parser.js';

// Pattern exports (for advanced users who want to customize)
export { QUOTE_PATTERNS } from './patterns/quotes.js';
export { AUTO_SIGNATURE_PATTERNS } from './patterns/signatures.js';
export { MAILING_LIST_PATTERNS } from './patterns/footers.js';

// Type exports
export type {
  EmailFragment,
  ParsedEmail,
  PatternDefinition,
  ParserOptions,
} from './types.js';

