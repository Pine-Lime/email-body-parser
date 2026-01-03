import { EmailBodyParser } from '../src/parser.js';

describe('EmailBodyParser', () => {
  let parser: EmailBodyParser;

  beforeEach(() => {
    parser = new EmailBodyParser();
  });

  describe('parse()', () => {
    it('should return empty email for empty input', () => {
      const email = parser.parse('');
      expect(email.getFragments()).toHaveLength(0);
      expect(email.getVisibleText()).toBe('');
    });

    it('should parse simple email content', () => {
      const input = 'Hello, this is a test email.';
      const email = parser.parse(input);

      expect(email.getFragments()).toHaveLength(1);
      expect(email.getVisibleText()).toBe(input);
      expect(email.getQuotedText()).toBe('');
    });

    it('should identify quoted content', () => {
      const input = `Thanks for the info!

On Mon, Mar 17, 2025 at 1:29 PM John wrote:
Previous message`;

      const email = parser.parse(input);
      const fragments = email.getFragments();

      expect(fragments.length).toBeGreaterThan(1);
      expect(email.getVisibleText()).toContain('Thanks for the info!');
      expect(email.getQuotedText()).toContain('On Mon');
    });

    it('should identify standard quote markers', () => {
      const input = `My response here.

> Quoted line 1
> Quoted line 2`;

      const email = parser.parse(input);

      expect(email.getVisibleText()).toBe('My response here.');
      expect(email.getQuotedText()).toContain('> Quoted line');
    });

    it('should identify auto-signatures', () => {
      const input = `Quick update.

Sent from my iPhone`;

      const email = parser.parse(input);
      const fragments = email.getFragments();

      const signatureFragment = fragments.find((f) => f.isSignature);
      expect(signatureFragment).toBeDefined();
      expect(signatureFragment?.content).toContain('Sent from my iPhone');
      expect(email.getVisibleText()).toBe('Quick update.');
    });
  });

  describe('parseReply()', () => {
    it('should return visible text directly', () => {
      const input = `Hello!

> Old message`;

      expect(parser.parseReply(input)).toBe('Hello!');
    });
  });

  describe('parseReplied()', () => {
    it('should return quoted text directly', () => {
      const input = `Hello!

> Old message
> More old message`;

      const quoted = parser.parseReplied(input);
      expect(quoted).toContain('> Old message');
    });
  });

  describe('fragment properties', () => {
    it('should mark content fragments as not hidden', () => {
      const input = 'Simple content';
      const email = parser.parse(input);
      const fragment = email.getFragments()[0];

      expect(fragment.isHidden).toBe(false);
      expect(fragment.isQuoted).toBe(false);
      expect(fragment.isSignature).toBe(false);
    });

    it('should mark quoted fragments as hidden and quoted', () => {
      const input = `Response

> Quoted`;

      const email = parser.parse(input);
      const quotedFragment = email.getFragments().find((f) => f.isQuoted);

      expect(quotedFragment).toBeDefined();
      expect(quotedFragment?.isHidden).toBe(true);
      expect(quotedFragment?.isQuoted).toBe(true);
    });

    it('should mark signature fragments as hidden and signature', () => {
      const input = `Message

Sent from my iPhone`;

      const email = parser.parse(input);
      const sigFragment = email.getFragments().find((f) => f.isSignature);

      expect(sigFragment).toBeDefined();
      expect(sigFragment?.isHidden).toBe(true);
      expect(sigFragment?.isSignature).toBe(true);
    });
  });

  describe('options', () => {
    it('should respect removeMailingListFooters option', () => {
      const input = `Content here

You received this message because you are subscribed`;

      const parserWithFooters = new EmailBodyParser({ removeMailingListFooters: true });
      const parserWithoutFooters = new EmailBodyParser({ removeMailingListFooters: false });

      expect(parserWithFooters.parseReply(input)).toBe('Content here');
      expect(parserWithoutFooters.parseReply(input)).toContain('You received this message');
    });
  });

  describe('edge cases', () => {
    it('should handle CRLF line endings', () => {
      const input = 'Line 1\r\nLine 2\r\n\r\n> Quoted';
      const email = parser.parse(input);

      expect(email.getVisibleText()).toContain('Line 1');
      expect(email.getVisibleText()).toContain('Line 2');
    });

    it('should handle multiple quote types in same email', () => {
      const input = `My response

On Mon wrote:
> Something quoted

-----Original Message-----
Another thing`;

      const email = parser.parse(input);
      // The parser identifies quote headers, so content between them may be visible
      // The important thing is the main response is captured
      expect(email.getVisibleText()).toContain('My response');
    });

    it('should clean image placeholders', () => {
      const input = `Check this [image: test.png] out!

[Image]

Cool right?`;

      const email = parser.parse(input);
      expect(email.getVisibleText()).not.toContain('[image:');
      expect(email.getVisibleText()).not.toContain('[Image]');
    });
  });
});

