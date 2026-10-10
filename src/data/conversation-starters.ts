import type { CategoryKey } from "../types/report";

/**
 * Conversation openers mapped to friction areas. Framed constructively:
 * they are doors into discussion, never accusations.
 */
export const CATEGORY_STARTERS: Record<CategoryKey, string[]> = {
  communication: [
    "What does 'good communication' actually look like for you day-to-day — constant chat, or meaningful check-ins?",
    "When you go quiet, what does that usually mean? How should I read it?",
    "Are you a 'call me' person or a 'text me first' person — and does it change when you're stressed?",
  ],
  emotional: [
    "When we disagree, what would make you feel genuinely heard?",
    "What's the best way to bring up something that hurt me without it turning into a fight?",
    "Do you process out loud or internally first? How can I support your style?",
  ],
  values: [
    "Where do you honestly see this going — and what timeline feels right to you?",
    "What does commitment mean to you in practice, not just in words?",
    "What's one lesson from your past relationships you never want to relearn?",
  ],
  financial: [
    "How do you feel about splitting costs when dating — and does that change as things get serious?",
    "What's your relationship with money like: saver, spender, or somewhere in between?",
    "What would 'building together' financially look like to you?",
  ],
  love: [
    "How do you feel most loved? Can you give me an example of a time you felt really appreciated?",
    "What's a small thing a partner could do daily that would mean a lot to you?",
    "How much physical affection feels right to you in public versus in private?",
  ],
  boundaries: [
    "What does healthy jealousy versus unhealthy jealousy look like to you?",
    "Where's the line for you between privacy and transparency in a relationship?",
    "What boundaries have you learned you need, the hard way?",
  ],
  accountability: [
    "When you realize you were wrong, how do you like to make it right?",
    "How do you prefer to receive feedback from a partner — direct, gentle, or written down?",
    "What would you want us to do the first time we have a really big argument?",
  ],
};

export const FLAG_STARTERS: Record<string, string> = {
  cheating_definition:
    "How do you each define cheating — what counts as crossing the line for you?",
  outside_attention:
    "How do we each want to handle attention from other people when we're together?",
  emotional_communication_gap:
    "When one of us needs space and the other needs to talk, what compromise could work for both?",
  privacy_expectations:
    "What level of phone/social privacy feels comfortable versus controlling to each of us?",
  intention_gap:
    "Are we looking for the same thing right now? What would 'this worked out' look like to each of us?",
  therapy_views:
    "If we hit a rough patch we couldn't solve alone, how would you feel about getting outside support?",
  commitment_readiness:
    "On a scale of 'ready tomorrow' to 'still figuring it out', where are you honestly at with commitment?",
};

export const GENERAL_STARTERS: string[] = [
  "What's your idea of a perfect ordinary Tuesday together?",
  "What's something you've never told a partner early on, but wish you had?",
  "What does your ideal balance of together-time versus alone-time look like?",
];
