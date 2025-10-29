import Dexie from "dexie";
import type { Deck, Change, Note } from "./schema";

class DB extends Dexie {
  decks!: Dexie.Table<Deck, string>;
  changes!: Dexie.Table<Change, string>;
  notes!: Dexie.Table<Note, string>;
  constructor() {
    super("mtgDeckNotes");
    this.version(1).stores({
      decks: "id, commanderName, updatedAt, *tags",
      changes: "id, deckId, status, createdAt",
      notes: "id, deckId, createdAt",
    });
  }
}
export const db = new DB();
