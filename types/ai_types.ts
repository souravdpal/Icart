export type AiProduct = {
  id: string;
  href: string;
  img: string;
  title: string;
  description?: string;
  rating: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  brand?: string;
  reviews?: number;
  stock?: number;
  isNew?: boolean;
  tag?: string | null;
};

export type AiBlock =
  | { type: "text"; text: string }
  | { type: "products"; title?: string; query: string; viewAllHref?: string; products: AiProduct[] }
  | { type: "redirect"; label: string; path: string; reason?: string; auto: boolean; external: boolean }
  | { type: "list"; title?: string; style: "bullets" | "steps"; items: string[] }
  | { type: "callout"; tone: "info" | "tip" | "warning"; text: string }
  | { type: "suggestions"; items: string[] };

export type AiReply = { blocks: AiBlock[] };
export type AskAiResult = { ok: true; data: AiReply } | { ok: false; error: string };
export type AiHistoryItem = { role: "user" | "assistant"; content: string };