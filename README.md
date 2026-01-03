# email-body-parser

Parse and clean email content - removes quotes, auto-signatures, and mailing list footers while **preserving human signatures**.

[![npm version](https://badge.fury.io/js/email-body-parser.svg)](https://www.npmjs.com/package/email-body-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Maintained by [Pinenlime](https://pinenlime.com)**

## Why Another Email Parser?

Unlike other email parsing libraries that aggressively remove all signatures, `email-body-parser` follows a conservative philosophy: **only remove things we're 100% sure are not content**.

| Feature | Other Libraries | email-body-parser |
|---------|-----------------|-------------------|
| Human signatures ("Best, John") | ❌ Removes | ✅ **Keeps** |
| Mobile auto-signatures | ✅ Removes | ✅ Removes |
| Quote headers | ✅ Removes | ✅ Removes |
| Mailing list footers | ❌ Not handled | ✅ **Removes** |
| Legal disclaimers | ❌ Not handled | ✅ **Removes** |
| Compressed Outlook headers | ❌ Basic | ✅ **Comprehensive** |

## Installation

```bash
npm install email-body-parser
```

## Usage

### Simple API

For most use cases, the `cleanEmailContent()` function is all you need:

```typescript
import { cleanEmailContent } from 'email-body-parser';

const rawEmail = `Thanks for the update!

Best regards,
John Smith
Product Manager

On Mon, Mar 17, 2025 at 1:29 PM Jane Doe <jane@example.com> wrote:
> Here's the latest report...

Sent from my iPhone`;

const cleaned = cleanEmailContent(rawEmail);
console.log(cleaned);
// Output:
// Thanks for the update!
//
// Best regards,
// John Smith
// Product Manager
```

### Advanced API

For more control, use the `EmailBodyParser` class:

```typescript
import EmailBodyParser from 'email-body-parser';

const parser = new EmailBodyParser();
const email = parser.parse(rawEmail);

// Get visible content (excludes quotes, auto-signatures)
console.log(email.getVisibleText());

// Get just the quoted portions
console.log(email.getQuotedText());

// Iterate over all fragments
for (const fragment of email.getFragments()) {
  console.log({
    content: fragment.content,
    isHidden: fragment.isHidden,
    isQuoted: fragment.isQuoted,
    isSignature: fragment.isSignature,
  });
}
```

### Convenience Methods

```typescript
const parser = new EmailBodyParser();

// Get visible text directly
const visibleText = parser.parseReply(rawEmail);

// Get quoted text directly
const quotedText = parser.parseReplied(rawEmail);
```

## What Gets Removed

### Quote Headers
- Gmail style: `On Mon, Mar 17, 2025 at 1:29 PM John <john@example.com> wrote:`
- Outlook style: `-----Original Message-----`
- Forward headers: `From: ... Sent: ... To: ... Subject: ...`
- Standard quote markers: `> quoted text`

### Auto-Generated Signatures
- Mobile: `Sent from my iPhone`, `Sent from my Android`
- Apps: `Sent via Superhuman`, `Get Outlook for iOS`
- Meeting links: `BOOK A MEETING...`

### Mailing List Footers
- Google Groups: `You received this message because...`
- Unsubscribe links: `Click here to unsubscribe`
- Marketing footers: `This email was sent to...`

### Legal Disclaimers
- `CONFIDENTIAL: This message contains...`
- `DISCLAIMER: This email and any files...`

## What Gets Preserved

**Human signatures are kept** because they provide valuable context:
- Contact information for follow-ups
- Job titles help understand urgency
- Avoids false positives

```typescript
const email = `Please review the attached document.

Best regards,
Sarah Williams
Senior Financial Analyst
Direct: (555) 234-5678
s.williams@example.com`;

cleanEmailContent(email);
// Returns the ENTIRE email - signature is preserved!
```

## API Reference

### `cleanEmailContent(content: string): string`

Cleans email content by removing quotes, auto-signatures, and mailing list footers.

**Parameters:**
- `content` - The raw email content to clean

**Returns:** Cleaned email content with quotes and auto-signatures removed

### `EmailBodyParser`

#### `constructor(options?: ParserOptions)`

**Options:**
- `keepSignatures` (default: `true`) - Keep human signatures
- `removeDisclaimers` (default: `true`) - Remove legal disclaimers
- `removeMailingListFooters` (default: `true`) - Remove mailing list footers

#### `parse(text: string): ParsedEmail`

Parses email content into fragments.

#### `parseReply(text: string): string`

Convenience method that returns visible text directly.

#### `parseReplied(text: string): string`

Convenience method that returns quoted text directly.

### `ParsedEmail`

#### `getFragments(): EmailFragment[]`

Returns all email fragments.

#### `getVisibleText(): string`

Returns content that is not hidden (excludes quotes, auto-signatures).

#### `getQuotedText(): string`

Returns only the quoted portions of the email.

### `EmailFragment`

```typescript
interface EmailFragment {
  content: string;      // The fragment text
  isHidden: boolean;    // True if this should be hidden from display
  isSignature: boolean; // True if this is an auto-signature
  isQuoted: boolean;    // True if this is quoted content
}
```

## Customizing Patterns

For advanced users, the pattern arrays are exported:

```typescript
import {
  QUOTE_PATTERNS,
  AUTO_SIGNATURE_PATTERNS,
  MAILING_LIST_PATTERNS,
} from 'email-body-parser';

// Each pattern has metadata for debugging
QUOTE_PATTERNS.forEach(({ pattern, description, example }) => {
  console.log(description, example);
});
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  EmailFragment,
  ParsedEmail,
  PatternDefinition,
  ParserOptions,
} from 'email-body-parser';
```

## RE2 Support (Optional)

For better performance and ReDoS protection, install RE2 as an optional peer dependency:

```bash
npm install re2
```

The library will automatically use RE2 when available.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Created and maintained by [Pinenlime](https://pinenlime.com).

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

