import { db } from "../../db/client";
import { nanoid } from "nanoid";
import type { Deck, Change, Note } from "../../db/schema";

export async function listDecks(query?: string) {
  const all = await db.decks.orderBy("updatedAt").reverse().toArray();
  if (!query) return all;
  const q = query.toLowerCase();
  return all.filter(
    (deck) =>
      deck.commander.toLowerCase().includes(q) ||
      deck.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export async function getDeck(id: string) {
  return db.decks.get(id);
}

export async function createDeck(
  input: Omit<Deck, "id" | "createdAt" | "updatedAt">
) {
  const now = Date.now();
  const deck: Deck = {
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  await db.decks.add(deck);
  return deck;
}

export async function updateDeck(id: string, patch: Partial<Deck>) {
  patch.updatedAt = Date.now();
  await db.decks.update(id, patch);
  return db.decks.get(id);
}

export async function addChange(
  deckId: string,
  change: Omit<
    Change,
    "id" | "createdAt" | "updatedAt" | "status" | "deckId"
  > & { status?: Change["status"] }
) {
  const now = Date.now();
  const c: Change = {
    id: nanoid(),
    deckId,
    createdAt: now,
    updatedAt: now,
    status: "proposed",
    ...change,
  };
  await db.changes.add(c);
  await updateDeck(deckId, {});
  return c;
}

export async function listChanges(deckId: string) {
  return db.changes.where({ deckId }).reverse().sortBy("createdAt");
}

export async function setChangeStatus(id: string, status: Change["status"]) {
  await db.changes.update(id, { status, updatedAt: Date.now() });
}

export async function addNote(
  deckId: string,
  body: string,
  type: Note["type"] = "general"
) {
  const note: Note = {
    id: nanoid(),
    deckId,
    type,
    body,
    createdAt: Date.now(),
  };
  await db.notes.add(note);
  await updateDeck(deckId, {});
  return note;
}

export async function listNotes(deckId: string) {
  return db.notes.where({ deckId }).reverse().sortBy("createdAt");
}
