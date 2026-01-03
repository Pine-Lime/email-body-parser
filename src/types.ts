/**
 * Email fragment types
 */
export interface EmailFragment {
  content: string;
  isHidden: boolean;
  isSignature: boolean;
  isQuoted: boolean;
}

/**
 * Parsed email with fragments
 */
export interface ParsedEmail {
  fragments: EmailFragment[];
  getVisibleText(): string;
  getQuotedText(): string;
  getFragments(): EmailFragment[];
}

/**
 * Pattern definition with metadata for debugging/documentation
 */
export interface PatternDefinition {
  pattern: RegExp;
  description: string;
  example: string;
}

/**
 * Parser options
 */
export interface ParserOptions {
  /** Keep human signatures (default: true) */
  keepSignatures?: boolean;
  /** Remove legal disclaimers (default: true) */
  removeDisclaimers?: boolean;
  /** Remove mailing list footers (default: true) */
  removeMailingListFooters?: boolean;
}

