import { cleanEmailContent } from '../src/cleaner.js';

describe('cleanEmailContent', () => {
  describe('basic functionality', () => {
    it('should return empty string for empty input', () => {
      expect(cleanEmailContent('')).toBe('');
    });

    it('should return empty string for null/undefined input', () => {
      expect(cleanEmailContent(null as unknown as string)).toBe('');
      expect(cleanEmailContent(undefined as unknown as string)).toBe('');
    });

    it('should return content as-is when no quotes or signatures', () => {
      const input = 'Hello, this is a simple email message.';
      expect(cleanEmailContent(input)).toBe(input);
    });
  });

  describe('quote removal', () => {
    it('should remove standard email quote markers', () => {
      const input = `Hello, this is my message.

> This is quoted text
> More quoted text`;

      expect(cleanEmailContent(input)).toBe('Hello, this is my message.');
    });

    it('should remove Gmail-style quote headers', () => {
      const input = `Thanks for the update!

On Mon, Mar 17, 2025 at 1:29 PM John Doe <john@example.com> wrote:
Previous message content here`;

      expect(cleanEmailContent(input)).toBe('Thanks for the update!');
    });

    it('should remove Outlook-style original message headers', () => {
      const input = `Here's my response.

-----Original Message-----
From: sender@example.com
Sent: Monday, March 17, 2025 1:29 PM`;

      expect(cleanEmailContent(input)).toBe("Here's my response.");
    });

    it('should handle compressed forward headers (real Outlook format)', () => {
      const input = `Can you help with this?

  From: support@company.comDate: Monday, March 18, 2024To: john@example.comSubject: Ticket #12345
  Previous conversation here...`;

      expect(cleanEmailContent(input)).toBe('Can you help with this?');
    });
  });

  describe('auto-signature removal', () => {
    it('should handle mobile device signatures', () => {
      const input = `Just confirming our meeting tomorrow.

Sent from my iPhone`;

      expect(cleanEmailContent(input)).toBe('Just confirming our meeting tomorrow.');
    });

    it('should remove Sent from my Android', () => {
      const input = `Quick update on the project.

Sent from my Android device`;

      expect(cleanEmailContent(input)).toBe('Quick update on the project.');
    });

    it('should remove Get Outlook for iOS', () => {
      const input = `I'll review this later.

Get Outlook for iOS`;

      expect(cleanEmailContent(input)).toBe("I'll review this later.");
    });

    it('should remove Sent via signatures', () => {
      const input = `Thanks for the info.

Sent via Superhuman`;

      expect(cleanEmailContent(input)).toBe('Thanks for the info.');
    });

    it('should remove meeting booking links', () => {
      const input = `THANKS
Tom Murphy IT Systems Engineer, Futureverse E: tom.murphy@futureverse.com BOOK A MEETINGhttps://outlook.office.com/bookwithme/user/463df6970d82426db6ba446a0c59415f@futureverse.com?anonymous&ep=signature

From: Ravenna help+TAI-cm7y0q4kt000q5gneqf0tbspg@mail.ravennahq.comDate: Thursday, 27 March 2025 at 11:57 To: Tom Murphy tom.murphy@futureverse.comSubject: Ravenna: [TAI-42] Lost Password Tom Murphy sent a new message.                     [Ravenna] Tom Murphy sent a new message.`;

      expect(cleanEmailContent(input)).toBe('THANKS');
    });
  });

  describe('legal disclaimer removal', () => {
    it('should remove legal disclaimers', () => {
      const input = `Here's the quarterly report you requested.

Let me know if you need anything else.

Best,
Sarah Williams
Senior Financial Analyst
Direct: (555) 234-5678
s.williams@example.com

CONFIDENTIAL: This message contains confidential information`;

      expect(cleanEmailContent(input)).toBe(`Here's the quarterly report you requested.

Let me know if you need anything else.

Best,
Sarah Williams
Senior Financial Analyst
Direct: (555) 234-5678
s.williams@example.com`);
    });

    it('should handle legal disclaimers after signatures', () => {
      const input = `Meeting proposal for next week.

Best wishes,
Legal Team

DISCLAIMER: This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed.`;

      expect(cleanEmailContent(input)).toBe(`Meeting proposal for next week.

Best wishes,
Legal Team`);
    });
  });

  describe('mailing list footer removal', () => {
    it('should remove Google Groups footer', () => {
      const input = `Thanks for the update on the project.

  --
  You received this message because you are subscribed to the Google Groups "engineering-team" group.
  To unsubscribe from this group and stop receiving emails from it, send an email to engineering-team+unsubscribe@company.com.
  To view this discussion visit https://groups.google.com/a/company.com/d/msgid/...`;

      expect(cleanEmailContent(input)).toBe('Thanks for the update on the project.');
    });

    it('should remove marketing email footers', () => {
      const input = `Here's your weekly digest of updates.

  Best,
  The Product Team

  This email was sent to john@example.com
  Manage your subscription preferences
  Click here to unsubscribe
  © 2024 Company Inc, 123 Main St, City, State 12345`;

      expect(cleanEmailContent(input)).toBe(`Here's your weekly digest of updates.

  Best,
  The Product Team`);
    });
  });

  describe('signature preservation', () => {
    it('should preserve legitimate content that might look like signatures', () => {
      const input = `To resolve this issue, please contact our support team:

Email: support@company.com
Phone: 1-800-SUPPORT
Hours: Mon-Fri 9am-5pm EST

Please reach out if you have any questions.`;

      // This is content, not a signature - should be preserved
      expect(cleanEmailContent(input)).toBe(input);
    });

    it('should preserve contact instructions in content', () => {
      const input = `To resolve this issue, please contact our support team:

  Email: support@company.com
  Phone: 1-800-SUPPORT
  Hours: Mon-Fri 9am-5pm EST

  They will help you immediately.`;

      // This is content, not a signature
      expect(cleanEmailContent(input)).toBe(input);
    });

    it('should keep human signatures', () => {
      const input = `Hello team,

Here's the information you requested.

Best regards,
Jane Smith
Product Manager
jane@example.com`;

      // Human signatures should be kept
      expect(cleanEmailContent(input)).toBe(input);
    });
  });

  describe('real customer support scenario', () => {
    it('should handle real customer support scenario', () => {
      const input = `I'm having trouble logging into my account.
  Can someone reset my password?

  Thanks,
  John

  Sent from my Samsung Galaxy`;

      expect(cleanEmailContent(input)).toBe(`I'm having trouble logging into my account.
  Can someone reset my password?

  Thanks,
  John`);
    });
  });

  describe('image placeholder removal', () => {
    it('should remove inline image placeholders', () => {
      const input = `Hello,

[image: screenshot.png]

Here's what I found.`;

      expect(cleanEmailContent(input)).toBe(`Hello,



Here's what I found.`);
    });

    it('should remove generic image placeholders', () => {
      const input = `Check this out:
[Image]
Pretty cool right?`;

      expect(cleanEmailContent(input)).toBe(`Check this out:

Pretty cool right?`);
    });
  });
});

