/**
 * Email Body Cleaner
 * 
 * Strips unwanted content from emails while preserving meaningful text.
 * Targets: quoted replies, device signatures, newsletter footers, disclaimers.
 * Preserves: human sign-offs and contact details within the message body.
 */

import { QUOTE_PATTERNS, AUTO_SIGNATURE_PATTERNS, MAILING_LIST_PATTERNS } from './patterns/index.ts';
import type { PatternDefinition } from './types.ts';

/**
 * Inline artifacts to strip (don't affect where we truncate)
 */
const ARTIFACT_PATTERNS: PatternDefinition[] = [
  {
    pattern: /\[image:[^\]]*\]/gi,
    description: 'Inline image reference',
    example: '[image: photo.jpg]',
  },
  {
    pattern: /\[Image\]/gi,
    description: 'Generic image tag',
    example: '[Image]',
  },
  {
    pattern: /\[cid:[^\]]*\]/gi,
    description: 'Content-ID reference',
    example: '[cid:img001@domain.com]',
  },
];

/**
 * Remove quoted replies, auto-signatures, and newsletter footers from email text.
 * Human sign-offs like "Thanks, John" are intentionally preserved.
 * 
 * @param text - Raw email body text
 * @returns Cleaned email content
 */
export function cleanEmailContent(text: string): string {
  if (!text) return '';

  // Strip inline artifacts first
  let result = text;
  for (const { pattern } of ARTIFACT_PATTERNS) {
    result = result.replace(pattern, '');
  }

  const lines = result.split('\n');
  const truncateAt = locateTruncationPoint(lines);
  
  return trimTrailingBlanks(lines.slice(0, truncateAt)).join('\n');
}

/**
 * Scan lines to find where automated/quoted content begins.
 * Returns the line index where we should stop (exclusive).
 */
function locateTruncationPoint(lines: string[]): number {
  for (let idx = 0; idx < lines.length; idx++) {
    const trimmed = lines[idx]?.trim() ?? '';

    // Quoted reply detected
    if (matchesAnyPattern(trimmed, QUOTE_PATTERNS)) {
      return idx;
    }

    // Auto-generated signature detected
    if (matchesAnyPattern(trimmed, AUTO_SIGNATURE_PATTERNS)) {
      return idx;
    }

    // Newsletter/mailing list footer detected
    if (matchesAnyPattern(trimmed, MAILING_LIST_PATTERNS)) {
      // Check if preceded by signature delimiter
      const prevLine = lines[idx - 1]?.trim();
      if (prevLine === '--') {
        return idx - 1;
      }
      return idx;
    }
  }

  return lines.length;
}

/**
 * Test if text matches any pattern in the list
 */
function matchesAnyPattern(text: string, patterns: PatternDefinition[]): boolean {
  return patterns.some(({ pattern }) => pattern.test(text));
}

/**
 * Remove empty lines from the end of the array
 */
function trimTrailingBlanks(lines: string[]): string[] {
  const result = [...lines];
  while (result.length > 0 && result[result.length - 1]?.trim() === '') {
    result.pop();
  }
  return result;
}

export default cleanEmailContent;
