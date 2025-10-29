export type Deck = {
  id: string;
  commander: string;
  colorIdentity: Array<"W" | "U" | "B" | "R" | "G">;
  format: "commander" | "Pauper" | "Standard";
  tags: string[];
  createdAt: number;
  updatedAt: number;
};

export type Change = {
  id: string;
  deckId: string;
  action: "add" | "cut";
  cardName: string;
  reason?: string;
  status: "proposed" | "accepted" | "rejected";
  createdAt: number;
  updatedAt: number;
};

export type Note = {
  id: string;
  deckId: string;
  type: "general" | "game" | "meta";
  body: string;
  createdAt: number;
};
