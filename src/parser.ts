/**
 * Fragment-based Email Parser
 * 
 * Breaks emails into semantic chunks: body content, quoted replies, 
 * auto-signatures, and newsletter footers. Designed to preserve
 * human-written sign-offs while filtering automated additions.
 */

import type { EmailFragment, ParsedEmail, ParserOptions } from './types.ts';
import { QUOTE_PATTERNS, AUTO_SIGNATURE_PATTERNS, MAILING_LIST_PATTERNS } from './patterns/index.ts';

/** Internal fragment representation */
class TextFragment implements EmailFragment {
  constructor(
    public content: string,
    public isHidden: boolean,
    public isSignature: boolean,
    public isQuoted: boolean
  ) {}

  toString(): string {
    return this.content;
  }
}

/** Parsed email with fragment access methods */
class ParsedEmailImpl implements ParsedEmail {
  constructor(public fragments: EmailFragment[]) {}

  getFragments(): EmailFragment[] {
    return this.fragments;
  }

  getVisibleText(): string {
    return this.fragments
      .filter((f) => !f.isHidden)
      .map((f) => f.content)
      .join('\n')
      .replace(/~+$/, '');
  }

  getQuotedText(): string {
    return this.fragments
      .filter((f) => f.isQuoted)
      .map((f) => f.content)
      .join('\n')
      .replace(/~+$/, '');
  }
}

type LineCategory = 'body' | 'quote' | 'autosig' | 'listfooter';

/**
 * Email parser that segments content into typed fragments.
 * 
 * Key behavior: Human sign-offs ("Best, John") are treated as body content,
 * while auto-generated signatures ("Sent from iPhone") are filtered.
 */
export class EmailBodyParser {
  private config: Required<ParserOptions>;

  constructor(options: ParserOptions = {}) {
    this.config = {
      keepSignatures: options.keepSignatures ?? true,
      removeDisclaimers: options.removeDisclaimers ?? true,
      removeMailingListFooters: options.removeMailingListFooters ?? true,
    };
  }

  /**
   * Parse email text into categorized fragments
   */
  parse(input: string): ParsedEmail {
    if (!input) {
      return new ParsedEmailImpl([]);
    }

    // Normalize and clean
    let text = input.replace(/\r\n/g, '\n');
    text = this.stripArtifacts(text);

    const lines = text.split('\n');
    const segments: EmailFragment[] = [];
    
    let buffer: string[] = [];
    let bufferCategory: LineCategory = 'body';

    for (const line of lines) {
      const category = this.categorize(line.trim());

      if (category !== bufferCategory && buffer.length > 0) {
        segments.push(this.buildFragment(buffer.join('\n'), bufferCategory));
        buffer = [];
      }

      bufferCategory = category;
      buffer.push(line);
    }

    if (buffer.length > 0) {
      segments.push(this.buildFragment(buffer.join('\n'), bufferCategory));
    }

    return new ParsedEmailImpl(segments);
  }

  /**
   * Shorthand: parse and return only visible content
   */
  parseReply(input: string): string {
    return this.parse(input).getVisibleText();
  }

  /**
   * Shorthand: parse and return only quoted content
   */
  parseReplied(input: string): string {
    return this.parse(input).getQuotedText();
  }

  private stripArtifacts(text: string): string {
    return text
      .replace(/\[image:[^\]]*\]/gi, '')
      .replace(/\[Image\]/gi, '')
      .replace(/\[cid:[^\]]*\]/gi, '');
  }

  private categorize(line: string): LineCategory {
    for (const { pattern } of QUOTE_PATTERNS) {
      if (pattern.test(line)) return 'quote';
    }

    for (const { pattern } of AUTO_SIGNATURE_PATTERNS) {
      if (pattern.test(line)) return 'autosig';
    }

    if (this.config.removeMailingListFooters) {
      for (const { pattern } of MAILING_LIST_PATTERNS) {
        if (pattern.test(line)) return 'listfooter';
      }
    }

    return 'body';
  }

  private buildFragment(text: string, category: LineCategory): EmailFragment {
    const cleaned = text.replace(/^\n+/, '').replace(/\n+$/, '');

    return new TextFragment(
      cleaned,
      category !== 'body',      // isHidden
      category === 'autosig',   // isSignature  
      category === 'quote'      // isQuoted
    );
  }
}

export default EmailBodyParser;
